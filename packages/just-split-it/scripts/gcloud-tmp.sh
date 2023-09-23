gcloud iam service-accounts add-iam-policy-binding "github-action-672062534@just-splitit.iam.gserviceaccount.com" \
  --project="just-splitit" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/1077756061576/locations/global/workloadIdentityPools/github-actions/attribute.repository/Eliav2/justSplitIt"
