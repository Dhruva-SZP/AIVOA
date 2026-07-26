"""
Lightweight text extraction for uploaded complaint sources. The assignment
explicitly says production-grade OCR/parsing isn't required, so this covers
the realistic demo cases: plain text, .eml emails, and text-based PDFs.
"""
import email
from email import policy
from io import BytesIO

from pypdf import PdfReader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()


def extract_text_from_eml(file_bytes: bytes) -> str:
    msg = email.message_from_bytes(file_bytes, policy=policy.default)
    subject = msg.get("subject", "")
    sender = msg.get("from", "")
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_content()
                break
    else:
        body = msg.get_content()
    return f"From: {sender}\nSubject: {subject}\n\n{body}".strip()


def extract_text(filename: str, file_bytes: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    if lower.endswith(".eml"):
        return extract_text_from_eml(file_bytes)
    # .txt or anything else - best-effort decode
    return file_bytes.decode("utf-8", errors="ignore").strip()
