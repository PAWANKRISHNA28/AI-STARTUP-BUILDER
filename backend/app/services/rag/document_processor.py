import os
import json
import csv
import logging
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from docx import Document

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )

    def extract_text(self, filepath: str) -> str:
        ext = filepath.split('.')[-1].lower()
        if ext == 'pdf':
            return self._extract_pdf(filepath)
        elif ext == 'docx':
            return self._extract_docx(filepath)
        elif ext in ['txt', 'md', 'csv', 'json']:
            return self._extract_text_file(filepath, ext)
        else:
            raise ValueError(f"Unsupported file extension: {ext}")

    def _extract_pdf(self, filepath: str) -> str:
        text = ""
        try:
            reader = PdfReader(filepath)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            logger.error(f"Error extracting PDF {filepath}: {e}")
        return text

    def _extract_docx(self, filepath: str) -> str:
        text = ""
        try:
            doc = Document(filepath)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            logger.error(f"Error extracting DOCX {filepath}: {e}")
        return text

    def _extract_text_file(self, filepath: str, ext: str) -> str:
        text = ""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                text = f.read()
        except Exception as e:
            logger.error(f"Error extracting {ext.upper()} {filepath}: {e}")
        return text

    def process_document(self, filepath: str, project_id: str, document_id: str) -> dict:
        """Extracts text, splits into chunks, returns texts, metadatas, and ids."""
        text = self.extract_text(filepath)
        chunks = self.text_splitter.split_text(text)
        
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            metadatas.append({
                "project_id": project_id,
                "document_id": document_id,
                "chunk_index": i
            })
            ids.append(f"{document_id}_{i}")
            
        # Clean up temporary file
        try:
            os.remove(filepath)
            logger.info(f"Cleaned up temporary file: {filepath}")
        except Exception as e:
            logger.warning(f"Failed to clean up file {filepath}: {e}")
            
        return {
            "texts": chunks,
            "metadatas": metadatas,
            "ids": ids
        }
