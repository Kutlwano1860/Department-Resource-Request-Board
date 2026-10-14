# PM-04 Final Project: ResourceHub

## Project Option

**Selected Option:** Department Resource Request Form

---

## Project Overview

ResourceHub is a department resource request and tracking application designed to help a team lead or department capture, manage, and track resource requests.

The application allows users to request different types of resources and track each request through the following workflow:

**Submitted → Approved → Resolved**

ResourceHub was developed using **HTML, CSS, and vanilla JavaScript**.

---

## Resource Types

Users can submit requests for:

- Equipment
- Software access
- Stationery
- Training material
- Meeting support

---

## Features

### 1. Request Form

The application provides a form for submitting resource requests.

Users can enter:

- Requester name
- Department
- Resource type
- Description
- Quantity
- Urgency

The form includes validation to ensure that required information is provided before a request can be submitted.

---

### 2. Request Board

Submitted requests are displayed on a three-column board:

| Status | Description |
|---|---|
| **Submitted** | Newly created requests |
| **Approved** | Requests that have been approved |
| **Resolved** | Requests that have been completed |

Each request is displayed as a card containing important request information.

---

### 3. Request Cards

Each request card displays:

- Request ID
- Requester name
- Department
- Resource type
- Quantity
- Urgency
- Description

Each request receives a unique ID such as:

`REQ-0001`

---

### 4. Statistics

The dashboard displays request statistics for:

- Total requests
- Submitted requests
- Approved requests
- Resolved requests

The statistics update when requests are added or moved between statuses.

---

### 5. Search

The request board includes a search function.

Users can search requests using:

- Requester name
- Resource type
- Description

---

### 6. Urgency Filter

Requests can be filtered by urgency.

Available options are:

- All
- Normal
- Urgent

The search and urgency filter can also be used together.

---

### 7. Drag and Drop

Requests can be moved between the board columns using drag and drop.

For example:

**Submitted → Approved → Resolved**

When a request is moved, its status is updated and saved.

---

### 8. CSV Report

ResourceHub includes a **Download Report** button.

Users can export their requests to a CSV file for reporting purposes.

The downloaded file is named:

`download-report.csv`

---

### 9. Theme Toggle

The application supports two themes:

- Dark mode
- Light mode

The selected theme is saved so that it remains active after refreshing the page.

---

### 10. Local Storage

ResourceHub uses browser **Local Storage** to store request information.

This allows requests and their updated statuses to remain available after the browser page is refreshed.

---

## Technologies Used

- **HTML5** — Page structure and form elements
- **CSS3** — Styling, layout, responsive design and themes
- **JavaScript** — Validation, DOM manipulation, request management, search, filtering, drag and drop, CSV export and Local Storage

---

## How to Use the Project

1. Open `index.html` in a web browser.
2. Complete the **New Request** form.
3. Enter the requester name.
4. Select a department.
5. Select a resource type.
6. Enter a description.
7. Enter the required quantity.
8. Select the urgency level.
9. Click **Submit Request**.
10. The request will appear in the **Submitted** column.
11. Drag the request between the status columns as its status changes.
12. Use the search box to find specific requests.
13. Use the urgency filter to filter requests.
14. Click **Download Report** to export the requests to CSV.
15. Use the theme button in the top-right corner to switch between light and dark mode.

---

## Testing Notes

### Form Validation

The following validation tests were performed:

- Empty requester name displays an error.
- Missing department displays an error.
- Missing resource type displays an error.
- Empty description displays an error.
- Invalid quantity displays an error.
- Valid information allows the request to be submitted.

### Request Submission

The following request submission tests were performed:

- A new request receives a unique request ID.
- New requests are assigned the `Submitted` status.
- Submitted requests appear on the request board.
- The request form resets after successful submission.
- Request statistics update after submission.

### Request Board

The following board tests were performed:

- Requests appear in the correct status column.
- Column counts update correctly.
- Request cards display the correct request information.
- Requests can be moved between status columns.

### Search and Filtering

The following search and filter tests were performed:

- Searching by requester name filters the results.
- Searching by resource type filters the results.
- Searching by description filters the results.
- Selecting **Normal** displays normal requests.
- Selecting **Urgent** displays urgent requests.
- Selecting **All** displays all requests.

### Drag and Drop

The following drag-and-drop tests were performed:

- Request cards can be dragged.
- Requests can be dropped into another status column.
- The request status updates after being moved.
- Statistics update after a request is moved.
- The updated status is saved.

### CSV Export

The following CSV tests were performed:

- Clicking **Download Report** downloads the report.
- The downloaded file is named `download-report.csv`.
- The CSV contains the request information.
- Multiple requests can be included in the report.

### Theme Toggle

The following theme tests were performed:

- The application starts in dark mode.
- The theme can be changed to light mode.
- The theme can be changed back to dark mode.
- The selected theme remains after refreshing the page.

### Data Persistence

The following Local Storage tests were performed:

- Submitted requests are saved.
- Request information remains after refreshing the page.
- Updated request statuses remain after refreshing the page.
- The selected theme remains after refreshing the page.

---

## Reflection

Working on ResourceHub helped me apply the HTML, CSS and JavaScript concepts covered during the project to a practical application.

One of the main areas we developed was working with forms and validation. we learned how to collect information from form fields, validate user input and provide feedback when required information is missing or incorrect.

we also developed my understanding of JavaScript DOM manipulation. The application dynamically creates request cards and updates the board when requests are submitted or moved.

Another important part of the project was learning how to work with arrays and objects to store request information. we used JavaScript to search, filter and update the request data.

The drag-and-drop functionality helped me understand JavaScript events and how different elements on a webpage can interact with each other.

we also learned how Local Storage can be used to keep application data available after refreshing a webpage. This made the application more useful because users do not lose their requests when the page is refreshed.

The CSV export feature also gave me experience with creating downloadable data from information stored in JavaScript.

Overall, the project helped me bring together multiple web development concepts into one working application. ResourceHub gave me practical experience with form handling, validation, DOM manipulation, event handling, Local Storage, filtering, drag and drop, themes and data export.

---

## Project Structure

```text
ResourceHub/
│
├── index.html
├── style.css
├── script.js
└── README.md