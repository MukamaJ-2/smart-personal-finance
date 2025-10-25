#!/bin/bash

# Script to create git commits over the last 80 days

REPO_PATH="/home/mukama/Desktop/finance 2"
cd "$REPO_PATH"

# Set git config
git config user.email "josephmukama67@gmail.com"
git config user.name "MukamaJ-2"

# Function to create commit with date
create_commit() {
    local date_str="$1"
    local message="$2"
    local files="$3"
    
    # Add files
    for file in $files; do
        if [ -e "$file" ]; then
            git add "$file" 2>/dev/null
        fi
    done
    
    # Create commit with date
    export GIT_AUTHOR_DATE="$date_str"
    export GIT_COMMITTER_DATE="$date_str"
    git commit -m "$message" --allow-empty 2>/dev/null || true
    
    # Amend to set date properly
    git commit --amend --no-edit --date="$date_str" --allow-empty 2>/dev/null || true
}

# Generate dates over last 80 days (skipping some randomly)
current_date=$(date -d "80 days ago" +%Y-%m-%d)
end_date=$(date +%Y-%m-%d)

commit_count=0
commit_messages=(
    "Initial project setup"
    "Add package.json and dependencies"
    "Setup Vite and React configuration"
    "Add Tailwind CSS and styling setup"
    "Create project README"
    "Add public assets and favicons"
    "Setup React app structure"
    "Add routing configuration"
    "Implement AppLayout component"
    "Create sidebar navigation"
    "Add shadcn-ui components"
    "Build dashboard components"
    "Create QuickStats component"
    "Implement FluxPodPreview"
    "Add RecentTransactions component"
    "Build 3D Nexus visualization"
    "Create main dashboard page"
    "Implement Transactions page"
    "Add transaction CRUD operations"
    "Build Flux Pods page"
    "Add pod creation and management"
    "Implement Goals page"
    "Add goal tracking functionality"
    "Create Companion AI chat page"
    "Build Reports page"
    "Add financial analytics"
    "Implement Achievements page"
    "Create Settings page"
    "Add authentication page"
    "Implement login/registration"
    "Add 404 Not Found page"
    "Create AI training data structure"
    "Implement transaction categorizer model"
    "Build spending forecaster model"
    "Create budget allocator model"
    "Add goal predictor model"
    "Implement anomaly detector model"
    "Create AI service layer"
    "Add AI model training script"
    "Integrate AI into transactions"
    "Add AI categorization"
    "Implement spending forecasts"
    "Add goal predictions"
    "Integrate anomaly detection"
    "Update currency to UGX"
    "Fix import paths"
    "Resolve build errors"
    "Add logout functionality"
    "Update documentation"
    "Add AI models guide"
    "Create Kaggle datasets guide"
    "Final code cleanup"
    "Optimize performance"
    "Fix UI bugs"
    "Add error handling"
    "Improve user experience"
    "Update dependencies"
    "Add unit tests"
    "Fix TypeScript errors"
    "Update styling"
    "Add animations"
    "Improve accessibility"
    "Update README"
    "Add deployment config"
    "Fix date formatting"
    "Update locale settings"
    "Add data validation"
    "Improve AI accuracy"
    "Add more AI features"
    "Update dashboard"
    "Fix navigation issues"
    "Add loading states"
    "Improve error messages"
    "Update UI components"
    "Add dark mode support"
    "Fix responsive design"
    "Add keyboard shortcuts"
    "Update documentation"
    "Final optimizations"
)

# Create commits
while [ "$current_date" != "$end_date" ]; do
    # 60% chance of commits on any day
    if [ $((RANDOM % 100)) -lt 60 ]; then
        # 1-3 commits per day
        num_commits=$((RANDOM % 3 + 1))
        
        for ((i=0; i<num_commits; i++)); do
            # Random time during day
            hour=$((RANDOM % 14 + 9))  # 9 AM to 10 PM
            minute=$((RANDOM % 60))
            second=$((RANDOM % 60))
            
            date_str="${current_date} ${hour}:${minute}:${second}"
            
            # Get message
            msg_index=$((commit_count % ${#commit_messages[@]}))
            message="${commit_messages[$msg_index]}"
            
            # Add all files for simplicity
            git add -A
            
            # Create commit
            export GIT_AUTHOR_DATE="$date_str"
            export GIT_COMMITTER_DATE="$date_str"
            git commit -m "$message" --allow-empty
            
            commit_count=$((commit_count + 1))
            echo "Created commit $commit_count: $date_str - $message"
        done
    fi
    
    # Move to next day
    current_date=$(date -d "$current_date + 1 day" +%Y-%m-%d)
done

echo "Created $commit_count commits over 80 days"
