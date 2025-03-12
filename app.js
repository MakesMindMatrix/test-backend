const express = require('express')
const app = express()

const user = require('./route/user.route')

app.use("/api/v1", user)

module.exports = app;



name: Backend Cloud Run Deployment

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    environment: prod
    steps:
      - name: checkout
        uses: actions/checkout@v4
      - name: Google Cloud Auth
        uses: google-github-actions/auth@v2
        with:
          credentials_json: "${{ secrets.GOOGLE_CREDENTIALS }}"
          project_id: ${{ vars.GCP_PROJECT_ID }}
      - name: Setup Cloud SDK
        uses: "google-github-actions/setup-gcloud@v2"

      - name: Configure Docker
        run: gcloud auth configure-docker us-central1-docker.pkg.dev
      - name: Build
        env:
          IMAGE_NAME: backend
          PROJECT_ID: ${{ vars.GCP_PROJECT_ID }}
        run: |-
          docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/${{ vars.GCP_REPO_NAME }}/$IMAGE_NAME:latest -f Dockerfile .
          docker push us-central1-docker.pkg.dev/$PROJECT_ID/${{ vars.GCR_REPO_NAME }}/$IMAGE_NAME:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy second-brain-backend \
              --image us-central1-docker.pkg.dev/${{ vars.GCP_PROJECT_ID }}/${{ vars.GCR_REPO_NAME }}/backend:latest \
              --platform managed \
              --port=8080 \
              --region us-central1 \
              --allow-unauthenticated \
              --set-env-vars "MONGODB_URI=${{ secrets.MONGODB_URI }},ACCESS_TOKEN_SECRET=${{secrets.ACCESS_TOKEN_SECRET}},ACCESS_TOKEN_EXPIRY=1d,CORS_ORIGIN=https://second-brain.ajayproject.com"
