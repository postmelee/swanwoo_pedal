# GEMINI.md

## General Instructions:

-   Think through the problem first, brainstorm solutions, and create a plan before create a code.

## Project Overview

This is a Next.js project that serves as a portfolio for "Swanwoo Pedals," a custom guitar effects pedal builder. The website showcases 3D models of the pedals, complete with specifications and custom illustrations. The site is designed to be a single-page application with a clean and modern aesthetic, featuring dynamic UI elements and interactive 3D models.

The project is built with the following technologies:

-   **Framework:** Next.js (with Turbopack)
-   **Language:** TypeScript
-   **UI:** React
-   **3D Rendering:** @react-three/fiber, @react-three/drei, three.js
-   **Styling:** CSS Modules, inline styles
-   **Linting:** ESLint

The application's architecture is straightforward. The main page (`app/page.tsx`) displays a list of 3D models, which are rendered using the `ModelView.tsx` and `Model.tsx` components. The `ModelView.tsx` component sets up the 3D scene, including lighting, camera controls, and interactive animations. The `Model.tsx` component is responsible for loading the 3D models themselves, which are in `.obj` and `.mtl` format. The pedal specifications are loaded from a `spec.json` file for each model.

## Building and Running

To get the project up and running, follow these steps:

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the development server with Turbopack, and you can view the application at [http://localhost:3000](http://localhost:3000).

3.  **Build for production:**

    ```bash
    npm run build
    ```

    This will create a production-ready build of the application.

4.  **Start the production server:**

    ```bash
    npm run start
    ```

    This will start the production server.

5.  **Lint the code:**
    ```bash
    npm run lint
    ```
    This will run ESLint to check for any code quality issues.

## Development Conventions

-   **Component-Based Architecture:** The project follows a component-based architecture, with a clear separation of concerns between different components.
-   **Styling:** The project uses a combination of CSS Modules and inline styles for styling.
-   **3D Models:** 3D models are stored in the `public/swanwoo_pedals_obj` directory, with each model having its own subdirectory containing the `.obj`, `.mtl`, and texture files.
-   **Specifications:** Pedal specifications are stored in a `spec.json` file within each model's directory.
-   **Error Handling:** The `ModelView.tsx` component includes an `ErrorBoundary` to gracefully handle errors that may occur during the loading of 3D models.
-   **Interactivity:** The application includes interactive elements, such as mouse-hover effects to rotate and zoom the 3D models.
