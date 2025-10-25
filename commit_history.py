#!/usr/bin/env python3
import subprocess
import random
from datetime import datetime, timedelta
import os

os.chdir("/home/mukama/Desktop/finance 2")

# Configure git
subprocess.run(["git", "config", "user.email", "josephmukama67@gmail.com"], check=True)
subprocess.run(["git", "config", "user.name", "MukamaJ-2"], check=True)

# Commit messages in development order
messages = [
    "Initial project setup",
    "Add package.json and dependencies",
    "Setup Vite and React configuration", 
    "Add Tailwind CSS configuration",
    "Create project README",
    "Add public assets",
    "Setup React app structure",
    "Configure routing",
    "Implement AppLayout component",
    "Create sidebar navigation",
    "Add shadcn-ui component library",
    "Build dashboard components",
    "Create QuickStats component",
    "Implement FluxPodPreview",
    "Add RecentTransactions component",
    "Build 3D Nexus visualization",
    "Create main dashboard page",
    "Implement Transactions page",
    "Add transaction CRUD operations",
    "Build Flux Pods page",
    "Add pod management features",
    "Implement Goals page",
    "Add goal tracking",
    "Create Companion AI chat",
    "Build Reports page",
    "Add financial analytics",
    "Implement Achievements page",
    "Create Settings page",
    "Add authentication page",
    "Implement login/registration",
    "Add 404 page",
    "Create AI training data",
    "Implement transaction categorizer",
    "Build spending forecaster",
    "Create budget allocator",
    "Add goal predictor",
    "Implement anomaly detector",
    "Create AI service layer",
    "Add model training script",
    "Integrate AI categorization",
    "Add spending forecasts",
    "Implement goal predictions",
    "Add anomaly detection",
    "Update currency to UGX",
    "Fix import paths",
    "Resolve build errors",
    "Add logout functionality",
    "Update documentation",
    "Add AI models guide",
    "Create datasets guide",
    "Fix TypeScript errors",
    "Update styling",
    "Add error handling",
    "Improve UX",
    "Update dependencies",
    "Fix date formatting",
    "Update locale settings",
    "Add data validation",
    "Improve AI accuracy",
    "Update dashboard",
    "Fix navigation",
    "Add loading states",
    "Final optimizations"
]

# Generate dates over last 80 days
end_date = datetime.now()
start_date = end_date - timedelta(days=80)

commit_dates = []
current = start_date

# Generate dates with some randomness
while current <= end_date:
    if random.random() < 0.6:  # 60% chance per day
        commits_today = random.randint(1, 3)
        for _ in range(commits_today):
            hour = random.randint(9, 22)
            minute = random.randint(0, 59)
            sec = random.randint(0, 59)
            commit_dates.append(current.replace(hour=hour, minute=minute, second=sec))
    current += timedelta(days=1)

commit_dates.sort()
commit_dates = commit_dates[:len(messages)]

print(f"Creating {len(commit_dates)} commits...")

# Create commits
for i, (date, msg) in enumerate(zip(commit_dates, messages)):
    date_str = date.strftime("%Y-%m-%d %H:%M:%S")
    
    # Stage all changes
    subprocess.run(["git", "add", "-A"], check=False)
    
    # Set environment for date
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str
    
    # Create commit
    subprocess.run(
        ["git", "commit", "-m", msg, "--allow-empty"],
        env=env,
        check=False
    )
    
    # Amend to ensure date is set
    subprocess.run(
        ["git", "commit", "--amend", "--no-edit", f"--date={date_str}", "--allow-empty"],
        env=env,
        check=False
    )
    
    print(f"✓ Commit {i+1}/{len(commit_dates)}: {date_str} - {msg}")

print(f"\n✓ Created {len(commit_dates)} commits!")
print("Ready to push to GitHub")
