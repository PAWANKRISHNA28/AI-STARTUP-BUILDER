import os

fp = r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\models\project.py'
with open(fp, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('owner_id = Column(String, ForeignKey("users.id"), nullable=False)', 'owner_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)')
c = c.replace('status = Column(String, default="draft")', 'status = Column(String, default="draft", index=True)')
c = c.replace('is_archived = Column(Boolean, default=False)', 'is_archived = Column(Boolean, default=False, index=True)')
c = c.replace('project_id = Column(String, ForeignKey("projects.id"), unique=True, nullable=False)', 'project_id = Column(String, ForeignKey("projects.id"), unique=True, nullable=False, index=True)')
c = c.replace('project_id = Column(String, ForeignKey("projects.id"), nullable=False)', 'project_id = Column(String, ForeignKey("projects.id"), nullable=False, index=True)')

with open(fp, 'w', encoding='utf-8') as f:
    f.write(c)

print("Indexes updated!")
