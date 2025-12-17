# Real Estate Staff App

A staff-only web application for capturing, searching, and updating detailed land and building records for real estate deals.  
Built with React + TypeScript on the frontend and Firebase Firestore as the backend datastore.

---

## Overview

This app is designed for internal staff working from different countries to maintain a centralized property database.

Staff can:

- Add new property records with detailed land, ownership, agricultural, and building information.
- Search and filter existing properties by village, survey number, area, land type, RTC/Khatha availability, and cost.
- Edit existing records directly from the search results and keep the Firestore data up to date.

The app is deployed to Firebase Hosting and accessed via a simple URL, so staff only need a browser and an internet connection.

---

## Tech Stack

- **Frontend:** React (Create React App) with TypeScript
- **Backend:** Firebase Cloud Firestore (NoSQL document database)
- **Hosting:** Firebase Hosting
- **Language:** TypeScript for all app logic, JSX/TSX for UI components

---

## Data Model (Firestore)

All property documents are stored in a `properties` collection in Firestore.

Each document follows the `Property` interface:

