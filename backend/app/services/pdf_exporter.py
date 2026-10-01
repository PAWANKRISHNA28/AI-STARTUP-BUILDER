import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_report(blueprint_data: dict, output_path: str) -> str:
    meta = blueprint_data.get("meta", {})
    title = meta.get("title", "Startup Blueprint")
    idea = meta.get("idea", "")
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#4F46E5'),
        spaceAfter=12
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#6B7280'),
        spaceAfter=20
    )

    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#111827'),
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#374151'),
        spaceAfter=6
    )

    elements = []
    
    # Title Header
    elements.append(Paragraph(f"AI STARTUP BUILDER - BLUEPRINT REPORT", subtitle_style))
    elements.append(Paragraph(title, title_style))
    elements.append(Paragraph(f"<b>Idea Description:</b> {idea}", body_style))
    elements.append(Paragraph(f"<b>Industry:</b> {meta.get('industry')} | <b>Budget:</b> {meta.get('budget')} | <b>Target Users:</b> {meta.get('target_users')}", subtitle_style))
    elements.append(Spacer(1, 15))

    # Idea Validation Section
    idea_val = blueprint_data.get("idea_analyzer", {})
    elements.append(Paragraph("1. Executive Summary & Validation", h2_style))
    elements.append(Paragraph(f"<b>Validation Score:</b> {idea_val.get('validation_score')}/100", body_style))
    elements.append(Paragraph(f"<b>Problem Statement:</b> {idea_val.get('problem_statement')}", body_style))
    elements.append(Paragraph(f"<b>Solution Overview:</b> {idea_val.get('solution_overview')}", body_style))
    elements.append(Paragraph(f"<b>Unique Value Proposition:</b> {idea_val.get('unique_value_proposition')}", body_style))
    elements.append(Spacer(1, 15))

    # Market Research Section
    mkt = blueprint_data.get("market_research", {})
    elements.append(Paragraph("2. Market Analysis (TAM / SAM / SOM)", h2_style))
    elements.append(Paragraph(f"<b>TAM (Total Addressable Market):</b> {mkt.get('tam')}", body_style))
    elements.append(Paragraph(f"<b>SAM (Serviceable Addressable Market):</b> {mkt.get('sam')}", body_style))
    elements.append(Paragraph(f"<b>SOM (Serviceable Obtainable Market):</b> {mkt.get('som')}", body_style))
    elements.append(Paragraph(f"<b>Growth Rate:</b> {mkt.get('industry_growth_rate')}", body_style))
    elements.append(Spacer(1, 15))

    # Business Model Canvas
    bmc = blueprint_data.get("business_model", {})
    elements.append(Paragraph("3. Business Model Canvas", h2_style))
    elements.append(Paragraph(f"<b>Revenue Streams:</b> {', '.join(bmc.get('revenue_streams', []))}", body_style))
    elements.append(Paragraph(f"<b>Value Propositions:</b> {bmc.get('value_propositions')}", body_style))
    elements.append(Paragraph(f"<b>Customer Segments:</b> {', '.join(bmc.get('customer_segments', []))}", body_style))
    elements.append(Spacer(1, 15))

    # Financials
    fin = blueprint_data.get("finance", {})
    elements.append(Paragraph("4. Financial Projections & Costs", h2_style))
    elements.append(Paragraph(f"<b>Initial Build Cost:</b> {fin.get('initial_build_cost')}", body_style))
    elements.append(Paragraph(f"<b>Monthly Infrastructure Cost:</b> {fin.get('monthly_server_infra')}", body_style))
    elements.append(Paragraph(f"<b>Break-Even Timeline:</b> {fin.get('break_even_timeline')}", body_style))
    elements.append(Paragraph(f"<b>ROI (Year 3):</b> {fin.get('roi_year3')}", body_style))
    elements.append(Spacer(1, 15))

    # Investor Pitch Deck Outline
    pitch = blueprint_data.get("investor_pitch", {})
    elements.append(Paragraph("5. Investor Pitch Deck Outline", h2_style))
    slides = pitch.get("slides", [])
    for slide in slides:
        elements.append(Paragraph(f"<b>Slide {slide.get('slide')}: {slide.get('title')}</b> - {slide.get('content')}", body_style))
        
    doc.build(elements)
    return output_path
