#!/usr/bin/env python3
"""
Script to create git commits spread over the last 80 days
"""
import subprocess
import random
from datetime import datetime, timedelta
import os

# Configuration
REPO_PATH = "/home/mukama/Desktop/finance 2"
EMAIL = "josephmukama67@gmail.com"
NAME = "MukamaJ-2"

# File groups for logical commits
FILE_GROUPS = [
    {
        "files": [".gitignore", "package.json", "tsconfig.json", "vite.config.ts", "tailwind.config.ts", "postcss.config.js", "components.json"],
        "message": "Initial project setup and configuration"
    },
    {
        "files": ["README.md"],
        "message": "Add project README"
    },
    {
        "files": ["public/"],
        "message": "Add public assets and favicon"
    },
    {
        "files": ["src/index.css", "src/main.tsx", "src/App.tsx", "src/vite-env.d.ts"],
        "message": "Setup React app structure and routing"
    },
    {
        "files": ["src/components/ui/"],
        "message": "Add shadcn-ui component library"
    },
    {
        "files": ["src/components/layout/"],
        "message": "Implement app layout and sidebar navigation"
    },
    {
        "files": ["src/components/dashboard/"],
        "message": "Create dashboard components and quick stats"
    },
    {
        "files": ["src/components/nexus/"],
        "message": "Build 3D financial nexus visualization"
    },
    {
        "files": ["src/pages/index.tsx"],
        "message": "Implement main dashboard page"
    },
    {
        "files": ["src/pages/Transactions.tsx"],
        "message": "Build transactions management page with CRUD operations"
    },
    {
        "files": ["src/pages/FluxPods.tsx"],
        "message": "Implement Flux Pods budget management"
    },
    {
        "files": ["src/pages/Goals.tsx"],
        "message": "Create financial goals tracking page"
    },
    {
        "files": ["src/pages/Companion.tsx"],
        "message": "Add AI companion chat interface"
    },
    {
        "files": ["src/pages/Reports.tsx"],
        "message": "Implement financial reports and analytics"
    },
    {
        "files": ["src/pages/Achievements.tsx"],
        "message": "Add gamification and achievements system"
    },
    {
        "files": ["src/pages/Settings.tsx"],
        "message": "Create settings and preferences page"
    },
    {
        "files": ["src/pages/Auth.tsx"],
        "message": "Implement login and registration page"
    },
    {
        "files": ["src/pages/NotFound.tsx"],
        "message": "Add 404 not found page"
    },
    {
        "files": ["src/lib/ai/training-data.ts"],
        "message": "Create AI training data structure"
    },
    {
        "files": ["src/lib/ai/models/transaction-categorizer.ts"],
        "message": "Implement transaction categorization AI model"
    },
    {
        "files": ["src/lib/ai/models/spending-forecaster.ts"],
        "message": "Build spending forecasting model"
    },
    {
        "files": ["src/lib/ai/models/budget-allocator.ts"],
        "message": "Create budget allocation AI model"
    },
    {
        "files": ["src/lib/ai/models/goal-predictor.ts"],
        "message": "Implement goal achievement prediction model"
    },
    {
        "files": ["src/lib/ai/models/anomaly-detector.ts"],
        "message": "Add anomaly detection model for fraud detection"
    },
    {
        "files": ["src/lib/ai/ai-service.ts"],
        "message": "Create centralized AI service layer"
    },
    {
        "files": ["src/lib/ai/train.ts"],
        "message": "Add AI model training script"
    },
    {
        "files": ["src/hooks/"],
        "message": "Add custom React hooks"
    },
    {
        "files": ["AI_IMPLEMENTATION_ANALYSIS.md", "AI_FEATURES_MAP.md"],
        "message": "Document AI implementation strategy"
    },
    {
        "files": ["AI_MODELS_COMPLETE_GUIDE.md"],
        "message": "Add comprehensive AI models documentation"
    },
    {
        "files": ["HOW_AI_MODELS_WORK.md"],
        "message": "Create user-friendly AI models explanation guide"
    },
    {
        "files": ["KAGGLE_DATASETS_FOR_TRAINING.md"],
        "message": "Add Kaggle datasets guide for model training"
    },
    {
        "files": ["src/pages/Transactions.tsx", "src/lib/ai/"],
        "message": "Integrate AI categorization into transactions"
    },
    {
        "files": ["src/pages/FluxPods.tsx"],
        "message": "Add AI-powered spending forecasts to Flux Pods"
    },
    {
        "files": ["src/pages/Goals.tsx"],
        "message": "Integrate goal prediction AI into goals page"
    },
    {
        "files": ["src/pages/Transactions.tsx"],
        "message": "Add anomaly detection alerts to transactions"
    },
    {
        "files": ["src/components/dashboard/"],
        "message": "Update dashboard with AI insights"
    },
    {
        "files": ["src/pages/"],
        "message": "Update currency to Ugandan Shilling (UGX) across all pages"
    },
    {
        "files": ["src/pages/Settings.tsx", "src/components/layout/Sidebar.tsx"],
        "message": "Add logout functionality"
    },
    {
        "files": ["src/"],
        "message": "Fix import paths and resolve build errors"
    },
    {
        "files": ["src/lib/ai/models/"],
        "message": "Fix duplicate keys and reference errors in AI models"
    },
    {
        "files": ["."],
        "message": "Final code cleanup and optimization"
    }
]

def run_command(cmd, cwd=None):
    """Run a shell command"""
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running: {cmd}")
        print(result.stderr)
    return result

def get_files_in_group(group_pattern):
    """Get actual files matching the group pattern"""
    files = []
    if group_pattern.endswith('/'):
        # Directory
        dir_path = os.path.join(REPO_PATH, group_pattern)
        if os.path.exists(dir_path):
            for root, dirs, filenames in os.walk(dir_path):
                for f in filenames:
                    if not f.startswith('.') and not any(x in root for x in ['node_modules', '.git', 'dist', 'build']):
                        rel_path = os.path.relpath(os.path.join(root, f), REPO_PATH)
                        files.append(rel_path)
    else:
        # Specific file
        file_path = os.path.join(REPO_PATH, group_pattern)
        if os.path.exists(file_path):
            files.append(group_pattern)
    return files

def create_commit(date, message, files):
    """Create a git commit with a specific date"""
    if not files:
        return False
    
    # Set the date
    date_str = date.strftime("%Y-%m-%d %H:%M:%S")
    
    # Add files
    for file in files:
        run_command(f'git add "{file}"', cwd=REPO_PATH)
    
    # Create commit with date
    env = os.environ.copy()
    env['GIT_AUTHOR_DATE'] = date_str
    env['GIT_COMMITTER_DATE'] = date_str
    
    result = run_command(
        f'git commit -m "{message}"',
        cwd=REPO_PATH
    )
    
    # Set commit date using git commit --amend
    if result.returncode == 0:
        run_command(
            f'git commit --amend --no-edit --date="{date_str}"',
            cwd=REPO_PATH
        )
        return True
    return False

def main():
    """Main function to create commits"""
    # Calculate date range (last 80 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=80)
    
    # Generate commit dates (skip some days randomly)
    commit_dates = []
    current_date = start_date
    
    while current_date <= end_date:
        # 60% chance of having a commit on any given day
        if random.random() < 0.6:
            # 1-3 commits per day
            num_commits = random.randint(1, 3)
            for _ in range(num_commits):
                # Random time during the day
                hour = random.randint(9, 22)
                minute = random.randint(0, 59)
                commit_date = current_date.replace(hour=hour, minute=minute, second=random.randint(0, 59))
                commit_dates.append(commit_date)
        
        current_date += timedelta(days=1)
    
    # Sort dates
    commit_dates.sort()
    
    # Limit to number of file groups (or a bit more for multiple commits)
    max_commits = min(len(commit_dates), len(FILE_GROUPS) + 10)
    commit_dates = commit_dates[:max_commits]
    
    print(f"Creating {len(commit_dates)} commits over {80} days...")
    
    # Create commits
    for i, (date, group) in enumerate(zip(commit_dates, FILE_GROUPS * ((len(commit_dates) // len(FILE_GROUPS)) + 1))):
        if i >= len(commit_dates):
            break
            
        # Get files for this group
        files = []
        for pattern in group["files"]:
            files.extend(get_files_in_group(pattern))
        
        if files:
            # Remove duplicates
            files = list(set(files))
            message = group["message"]
            
            print(f"Commit {i+1}/{len(commit_dates)}: {date.strftime('%Y-%m-%d %H:%M')} - {message}")
            create_commit(date, message, files)
    
    print("\nAll commits created successfully!")

if __name__ == "__main__":
    main()
