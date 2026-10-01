import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage
from app.agents.llm_factory import get_llm
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.visualization import VisualizationProject, DesignReport, BrandStyle, VisualizationImage
from sqlalchemy import select

class ImagePromptOutput(BaseModel):
    concept_name: str = Field(description="Name of the concept, e.g. 'Storefront Exterior', 'Product Packaging'")
    view_type: str = Field(description="Type of view, e.g. 'Exterior', 'Interior', 'Product Close-up'")
    prompt: str = Field(description="A highly detailed text-to-image prompt optimized for Midjourney or DALL-E 3")
    style: str = Field(description="The artistic style, e.g. 'Photorealistic', 'Vector Art'")

class VisualizationOutput(BaseModel):
    design_summary: str = Field(description="Overall design and architectural summary")
    business_theme: str = Field(description="Core thematic elements of the business")
    architecture_style: str = Field(description="Recommended architectural style")
    color_palette: List[str] = Field(description="Hex codes of the recommended color palette")
    material_suggestions: List[str] = Field(description="Recommended building/interior materials")
    furniture_suggestions: List[str] = Field(description="Recommended furniture types")
    lighting_suggestions: List[str] = Field(description="Recommended lighting setups")
    branding_suggestions: List[str] = Field(description="Suggestions for general branding")
    
    store_logo_placement: str = Field(description="Where and how the logo should be placed")
    sign_board: str = Field(description="Design suggestions for the sign board")
    menu_board: str = Field(description="Design suggestions for the menu board (if applicable)")
    reception_branding: str = Field(description="Design suggestions for reception or checkout area")
    employee_uniform_colors: List[str] = Field(description="Hex codes for employee uniforms")
    packaging_style: str = Field(description="Product packaging style")
    
    image_prompts: List[ImagePromptOutput] = Field(description="3 to 5 highly detailed image generation prompts for visualizing the business")

class VisualizationAgent:
    def __init__(self):
        self.llm = get_llm(
            temperature=0.7, 
            require_structured_output=True, 
            structured_schema=VisualizationOutput
        )

    async def generate_visualization(self, viz_project_id: str):
        print(f"[VisualizationAgent] Starting generation for VisualizationProject {viz_project_id}")
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(VisualizationProject).where(VisualizationProject.id == viz_project_id))
            viz_proj = result.scalars().first()
            if not viz_proj:
                print(f"[VisualizationAgent] VisualizationProject {viz_project_id} not found.")
                return

            if not self.llm:
                print(f"[VisualizationAgent] No OPENAI_API_KEY. Using mock visualization data.")
                viz_data = VisualizationOutput(
                    design_summary="A modern, eco-friendly design.",
                    business_theme="Sustainability",
                    architecture_style="Modern Minimalist",
                    color_palette=["#4CAF50", "#FFFFFF", "#333333"],
                    material_suggestions=["Bamboo", "Recycled Glass"],
                    furniture_suggestions=["Minimalist wooden chairs"],
                    lighting_suggestions=["Warm LED track lights"],
                    branding_suggestions=["Earthy tones with clean typography"],
                    store_logo_placement="Centered above the main entrance",
                    sign_board="Wooden backlit sign",
                    menu_board="Digital screens with wooden frames",
                    reception_branding="Living moss wall behind the counter",
                    employee_uniform_colors=["#4CAF50", "#333333"],
                    packaging_style="Recyclable kraft paper with green stamps",
                    image_prompts=[
                        ImagePromptOutput(
                            concept_name="Storefront Exterior",
                            view_type="Exterior",
                            prompt="A highly detailed photorealistic exterior of a modern eco-friendly coffee shop, bamboo accents, living moss wall, warm lighting, dusk.",
                            style="Photorealistic"
                        )
                    ]
                )
            else:
                messages = [
                    SystemMessage(content="You are a master Creative Director and Architectural Designer. Synthesize the provided startup details into a cohesive design report, brand style guide, and highly optimized image generation prompts."),
                    HumanMessage(content=f"Business Name: {viz_proj.business_name}\nType: {viz_proj.business_type}\nTheme: {viz_proj.preferred_theme}\nTarget Audience: {viz_proj.target_audience}\nBudget: {viz_proj.budget}")
                ]
                try:
                    viz_data = await self.llm.ainvoke(messages)
                except Exception as e:
                    print(f"[VisualizationAgent] LLM Error: {e}")
                    return

            # Save Design Report
            report = DesignReport(
                visualization_project_id=viz_proj.id,
                design_summary=viz_data.design_summary,
                business_theme=viz_data.business_theme,
                architecture_style=viz_data.architecture_style,
                color_palette=viz_data.color_palette,
                material_suggestions=viz_data.material_suggestions,
                furniture_suggestions=viz_data.furniture_suggestions,
                lighting_suggestions=viz_data.lighting_suggestions,
                branding_suggestions=viz_data.branding_suggestions
            )
            db.add(report)
            
            # Save Brand Style
            brand = BrandStyle(
                visualization_project_id=viz_proj.id,
                store_logo_placement=viz_data.store_logo_placement,
                sign_board=viz_data.sign_board,
                menu_board=viz_data.menu_board,
                reception_branding=viz_data.reception_branding,
                employee_uniform_colors=viz_data.employee_uniform_colors,
                packaging_style=viz_data.packaging_style
            )
            db.add(brand)
            
            # Save Image Prompts as stubs in VisualizationImage
            for p in viz_data.image_prompts:
                img = VisualizationImage(
                    visualization_project_id=viz_proj.id,
                    concept_name=p.concept_name,
                    view_type=p.view_type,
                    image_url=p.prompt, # Storing prompt here temporarily! 
                    style=p.style
                )
                db.add(img)

            from app.services.analytics_service import AnalyticsService
            await AnalyticsService.track_event(db, "visualization_generated")

            await db.commit()
            print(f"[VisualizationAgent] Generation complete for project {viz_proj.id}")
