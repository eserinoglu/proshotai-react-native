# ProShot AI - Professional Product Photography Generator

> ⚠️ **IMPORTANT**: The ProShot AI API must be set up and running before you can use the mobile app. Please follow the API setup instructions below before proceeding with the mobile app setup.

ProShot AI is a powerful mobile application that transforms regular product photos into professional, e-commerce-ready product photographs using advanced AI technology.

<img src="https://github.com/user-attachments/assets/e765e3a7-5d7a-4a5b-89dd-d4bc5a1526d2" width="200" height="auto" style='border-radius:24px'/>
<img src="https://github.com/user-attachments/assets/9e0b5d41-a3d1-4ba5-a39e-6960a60a5730" width="200" height="auto" style='border-radius:24px'/>
<img src="https://github.com/user-attachments/assets/c9aff12e-671e-4cfd-b64e-a1c985f7069b" width="200" height="auto" style='border-radius:24px'/>
<img src="https://github.com/user-attachments/assets/ce9fc4f7-0631-414a-bee5-a5b7780a3d97" width="200" height="auto" style='border-radius:24px'/>


## Features

- **AI-Powered Image Generation**: Transform regular product photos into professional, high-quality product photographs
- **Customizable Shot Types**: Multiple presentation types, shot sizes, and background options
- **Credit System**: Managed credit system for image generation
- **History Tracking**: View and manage your generated images history
- **User-Friendly Interface**: Clean and intuitive UI built with React Native

## Technology Stack

- **Frontend Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: Custom React hooks and Zustan stores
- **Authentication & Storage**:
  - Supabase
  - Expo SecureStore
  - SQLite for local storage
- **Image Handling**:
  - Expo ImagePicker
  - Expo ImageManipulator
  - Expo MediaLibrary
- **Payment Integration**: RevenueCat for in-app purchases
- **UI Components**: Lucide React Native for icons

## API Setup (Required)

This application requires a backend API to function properly. You must set up and run the API before using the mobile app.

### API Features

- Image generation using AI models
- User authentication and credit management
- Image storage and retrieval

👉 **[View the Complete API Documentation](https://github.com/eserinoglu/proshot-api)** for detailed setup instructions and API reference.

> Note: Keep the API server running while using the mobile app. All app features require an active API connection.

## Mobile App Setup

> ⚠️ **Prerequisite**: Ensure the API server is set up and running before proceeding.

1. Clone the repository:
   ```bash
   git clone https://github.com/eserinoglu/proshotai-react-native
   cd proshotai-react-native
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the API (follow instructions in the API repository)
4. Start the development server:
   ```bash
   npm run ios # for iOS
   # or
   npm run android # for Android
   ```

> Note: The app will not function properly if the API server is not running.

## Environment Setup

Make sure you have:

- Node.js installed
- Expo CLI installed globally
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Contact & Support

For support or feedback, contact: ethemserinoglu12@gmail.com

## License

All rights reserved. This project is proprietary and confidential.
