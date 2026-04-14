import docx

def read_docx(file_path):
    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

if __name__ == "__main__":
    import sys
    path = r"C:\Users\ulver\Downloads\KUYEN_PRD_v1.0.docx"
    try:
        content = read_docx(path)
        sys.stdout.reconfigure(encoding='utf-8')
        print(content)
    except Exception as e:
        print(f"Error reading docx: {e}")
