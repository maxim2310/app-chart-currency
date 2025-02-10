# App Chart Currency

A real-time market data visualization app built with Angular, integrated with the Fintacharts platform and TradingView’s Lightweight Charts. The app displays both real-time and historical price data, with interactive charts to monitor the financial markets.
## Demo

You can see a live demo of the application here: [App Chart Currency - Demo](https://app-chart-currency.netlify.app/)

## Features

- Display real-time market data using WebSockets
- Interactive charts with historical price data
- Supports multiple market instruments
- Built with Angular 19
- Uses the Lightweight Charts library for high-performance charting
- Simple and clean UI for easy tracking of price movements

## Technologies Used

- **Angular 19**: The main framework used to build the app.
- **Lightweight Charts**: A library by TradingView for rendering interactive charts.
- **WebSocket API**: For fetching real-time data.
- **Fintacharts API**: For retrieving historical price data and real-time market information.
- **RxJS**: To handle asynchronous data streams.
- **Netlify**: For hosting and deploying the application.

## Prerequisites

Before you start, make sure you have the following installed on your local machine:

- Node.js (preferably v18 or later)
- npm (Node Package Manager)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/maxim2310/app-chart-currency.git
   cd app-chart-currency
2. **Install the dependencies**
   ```bash
   npm install
3. **Running the Application Locally**
   ```bash
   ng serve
