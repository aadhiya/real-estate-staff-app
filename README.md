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


This schema supports:

- **Location and survey**: village name, survey number, area in acres and cents.  
- **Legal / documentation flags**: RTC availability, FMB sketch details, conversion details, Khatha information.  
- **Parties**: owner name/address/mobile, broker name/mobile.  
- **Financials**: owner’s land cost, whether negotiable.  
- **Agricultural details**: borewells, openwells/lakes/ponds, areca/coconut details, other cultivation.  
- **Buildings**: one or more building records with area and year of construction.

---

## App Flow

### App Layout

`App.tsx` provides the high-level layout:

- A header section with app title and description.
- Two main tabs:
  - **Add New Property** – shows `PropertyForm`.
  - **View & Search Properties** – shows `PropertyList`.

State in `App.tsx` controls which tab is active.

### Adding a Property (`PropertyForm`)

Component: `src/components/PropertyForm.tsx`

Flow:

1. User opens the **Add New Property** tab.
2. The form initializes local state representing a `Property` object with default values.
3. The form is organized into sections:
   - Basic land details: village, survey number, area.
   - Documentation: RTC, FMB sketch description, conversion type and order details, Khatha.
   - Owner and broker details.
   - Financials: land cost, cost negotiable.
   - Agricultural details (borewells, openwells, plantations, other cultivation).
   - Buildings: dynamic list where staff can add/remove building entries with area and construction year.

When the user clicks **Save property**:

- `handleSubmit` prevents default form behavior.
- For **new** records (no `docId` prop):
  - Builds a `payload` object from the current form state.
  - Adds `createdAt` and `updatedAt` timestamps.
  - Calls `addDoc(collection(db, 'properties'), payload)` to write to Firestore.
- On success, the form is cleared and a success message is shown.
- On failure, an error message displays the Firestore error.

When editing (see below), the same form updates an existing document instead of adding a new one.

### Viewing and Searching Properties (`PropertyList`)

Component: `src/components/PropertyList.tsx`

Responsibilities:

- Fetch a list of properties from Firestore using `getDocs` with dynamic `query()` conditions.
- Display search filters.
- Render a list of matching properties and provide an **Edit** action.

Supported filters:

- Village name (client-side partial match).
- Survey number (client-side partial match).
- Area range (min/max acres).
- Owner land cost range (min/max).
- Land conversion type: all / none / residential / commercial.
- RTC available only.
- Cost negotiable only.

Implementation:

1. `filters` state holds the current filter values.
2. `loadData` builds a Firestore query using `where` for RTC, conversion type, area, and cost ranges when provided, plus `orderBy` and `limit` for efficiency.
3. After fetching, client-side filtering is applied for partial text matches (village and survey) and negotiable-only flag.
4. Results are rendered as cards with village, survey number, area, RTC/Khatha/converted status, owner/broker details, and cost.

### Editing an Existing Property

Editing uses the same `PropertyForm` component:

1. In `PropertyList`, each property card includes an **Edit** button.
2. When clicked, `startEdit(id)` loads the document from Firestore using `getDoc(doc(db, 'properties', id))` and stores it as `editingData` and `editingId`.
3. If `editingId` and `editingData` are set, `PropertyList` renders:
   - A heading “Edit Property”.
   - `<PropertyForm initialData={editingData} docId={editingId} onSaved={...} />`.
   - A **Cancel** button to exit edit mode.
4. On save from the edit form:
   - `PropertyForm` calls `setDoc(doc(db, 'properties', docId), {...}, { merge: true })` to update the existing document.
   - `onSaved` clears editing state and reloads the list so changes are visible immediately.

---

## Deployment

Deployment uses Firebase Hosting:

1. Initialize Hosting in the project directory:

firebase init hosting

2. Build a production bundle:

npm run build

3. Deploy:

firebase deploy --only hosting

4. Firebase returns a URL like:

https://YOUR_PROJECT_ID.web.app


This URL is shared with staff for global browser access.

---

## Development Setup

### Prerequisites

- Node.js and npm
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Firestore enabled
- Web app configuration added to `src/firebase.ts`

### Local Development

npm install
npm start

The app runs at `http://localhost:3000` with hot reload.

---

## Future Enhancements

- **File storage:** Enable Firebase Storage and add upload fields for property photos, RTC copies, and FMB/conversion sketches; store file URLs in Firestore.
- **Authentication:** Use Firebase Authentication to restrict access to staff accounts only.
- **Role-based access:** Different permissions for data entry vs. supervisors/admins.
- **Advanced search:** Add filters for plantations, buildings, and free-text search across multiple fields.
- **Analytics:** Dashboards summarizing total acres, average cost, and distribution by village, land type, or other key attributes.

---




=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

