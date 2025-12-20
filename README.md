Halleyx Dashboard Configuration POC – 2025
📌 Project Overview

This project is a Proof of Concept (POC) for Halleyx that demonstrates a Custom Dashboard Builder.
It allows users to create and manage personalized dashboards using configurable widgets such as KPIs, Charts, and Tables, all driven by Customer Order data.

The goal of this POC is to validate dashboard configurability, data-driven widgets, and user-specific experiences, not to deliver a production-ready system.

🎯 Key Objectives

Enable user-specific dashboards

Provide drag-and-drop dashboard configuration

Link dashboard widgets dynamically to Customer Order data

Support filters, aggregations, and responsive layouts

Demonstrate feasibility through a functional UI

✨ Features Implemented
🔐 Authentication

User signup and login using email

Password validation (minimum length enforced)

Each user has access to their own dashboard

Session handling on page reload

📊 Dashboard Builder

Configure dashboards using drag-and-drop

Widgets supported:

KPI Card

Bar Chart

Line Chart

Area Chart

Scatter Plot

Pie Chart

Table

Widgets can be:

Added

Resized (rows & columns)

Deleted

Reconfigured at any time

Dashboard configuration can be saved and edited later

🧩 Widget Configuration
KPI Widget

Select metric from Customer Order data

Aggregation options:

Sum

Average

Count

Data format:

Number

Currency

Decimal precision control

Charts

X-axis and Y-axis field selection

Supports multiple chart types

Optional chart styling

Dynamic data updates based on orders

Table Widget

Column selection (multi-select)

Sorting and pagination

Filters based on date ranges

Optional styling options

🧾 Customer Order Module

Create, edit, and delete orders

Mandatory field validation

Automatic total calculation (Quantity × Unit Price)

Order status management:

Pending

In Progress

Completed

Orders act as the single data source for dashboards

📅 Filters

Date-based filtering supported:

All Time

Today

Last 7 Days

Last 30 Days

Last 90 Days

Filters affect KPIs, charts, and tables consistently

📱 Responsive Design

Desktop: 12-column grid

Tablet: 8-column grid

Mobile: 4-column stacked layout

Widgets rearrange automatically based on screen size

🌙 Additional Enhancements

Dark mode support (user preference)

Smooth UI interactions

Clean and modular component structure

🛠 Tech Stack

Frontend: React + TypeScript

State Management: Zustand (with persistence)

Authentication & Backend: Supabase

Styling: Tailwind CSS

Build Tool: Vite

🧠 Architecture Notes

Dashboard and widget configurations are user-specific

Widgets consume data dynamically from the Customer Order module

Zustand is used to manage dashboard state efficiently

Supabase handles authentication and user identity

This POC focuses on functionality and interaction, not production scalability

📌 What This POC Is (and Is Not)
✅ This POC:

Demonstrates real dashboard behavior

Shows configurable, data-driven UI

Validates feasibility of the product concept

❌ This POC:

Is not a full production system

Does not focus on advanced analytics performance

Uses simplified data persistence for demonstration

🔗 References

Figma Design:
https://www.figma.com/design/OxehpckRxybBDFJSKAchOp/Halleyx-POC---2025

Halleyx Component Library:
https://components.halleyx.com/select

👤 Author

Naveen D
Developer
Halleyx Dashboard Configuration POC – 2025
