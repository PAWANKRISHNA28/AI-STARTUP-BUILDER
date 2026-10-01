import os
import uuid
from typing import Optional, BinaryIO, Any
import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Initialize Cloudinary if credentials exist
if getattr(settings, 'CLOUDINARY_CLOUD_NAME', None) and getattr(settings, 'CLOUDINARY_API_KEY', None) and getattr(settings, 'CLOUDINARY_API_SECRET', None):
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
    _CLOUDINARY_CONFIGURED = True
else:
    _CLOUDINARY_CONFIGURED = False
    print("[StorageService] Cloudinary credentials missing. Storage will run in mock mode.")


class StorageService:
    @staticmethod
    async def upload_file(file_obj: BinaryIO, folder: str = "ai_startup_builder") -> Optional[str]:
        """Upload a file-like object to Cloudinary and return the secure URL."""
        if not _CLOUDINARY_CONFIGURED:
            # Mock mode: return a dummy URL
            mock_url = f"https://mock-storage.com/{folder}/mock-image-{uuid.uuid4().hex[:8]}.jpg"
            print(f"[StorageService Mock] Pretending to upload file. URL: {mock_url}")
            return mock_url
            
        try:
            # Cloudinary SDK is synchronous, so in high-concurrency environments 
            # you might want to wrap this in an async executor
            response = cloudinary.uploader.upload(
                file_obj,
                folder=folder
            )
            return response.get("secure_url")
        except Exception as e:
            print(f"[StorageService] Failed to upload file: {e}")
            return None

    @staticmethod
    async def upload_image_url(image_url: str, folder: str = "ai_startup_builder") -> Optional[str]:
        """Upload an image directly from an external URL (e.g. from OpenAI) to Cloudinary."""
        if not _CLOUDINARY_CONFIGURED:
            print(f"[StorageService Mock] Pretending to upload from URL: {image_url}")
            return image_url
            
        try:
            response = cloudinary.uploader.upload(
                image_url,
                folder=folder
            )
            return response.get("secure_url")
        except Exception as e:
            print(f"[StorageService] Failed to upload image from URL: {e}")
            return None
