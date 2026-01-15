# OMG Event Launch App

A React TypeScript application for the OMG (Oh My God) event launch page featuring Maha Yaagam and Rudraksh Recharged offerings.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Routing**: React Router setup with Home, Temples, and Store pages
- **Animated Logo**: Logo with infinite tilt animation
- **Video Cards**: Two main event cards with video support
- **Tailwind CSS**: Styled with Tailwind CSS for modern UI

## Video Files Required

Place the following video files in the `public/videos/` directory:

- `maha-yaagam.mp4` - Video for the Maha Yaagam event card (left card)
- `rudraksh.mp4` - Video for the Rudraksh Recharged card (right card)

The videos will automatically play, loop, and be muted for better user experience.

## Project Structure

```
src/
├── components/
│   ├── Navbar/          # Navigation bar component
│   ├── AnimatedLogo/    # Animated logo with tilt effect
│   └── EventCard/       # Reusable event card component
├── pages/
│   ├── Home.tsx         # Main home page with two cards
│   ├── Temples.tsx      # Temples page
│   └── Store.tsx        # Store page
└── App.tsx              # Main app with routing
```

## Getting Started

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
