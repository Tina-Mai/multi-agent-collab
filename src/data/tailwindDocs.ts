export const TAILWIND_DOCUMENTATION = `Below is a comprehensive collection of code-focused examples and instructions derived conceptually from the Tailwind CSS v2 documentation. Just as done previously with Hugging Face, these snippets are geared towards giving an AI agent practical guidance and references. They showcase how to install, configure, customize, and extend Tailwind CSS using code. This includes initializing configuration, creating responsive designs, customizing themes, using variants, implementing dark mode, integrating with build tools, and leveraging plugins and directives. All information here is newly presented and does not repeat previously provided Tailwind examples.

Installation & Project Setup

# Install Tailwind CSS and its peer-dependencies
npm install tailwindcss@latest postcss@latest autoprefixer@latest

# Generate a Tailwind config file
npx tailwindcss init

tailwind.config.js (Basic structure after initialization):

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'], // v2: specify template paths
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}

postcss.config.js (Integrating Tailwind with PostCSS):

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ]
}

Including Tailwind in Your CSS

src/styles.css (Import Tailwind’s layers):

@tailwind base;
@tailwind components;
@tailwind utilities;

After building, Tailwind’s utility classes will be available for use in your HTML and templates.

Applying Utility Classes in HTML

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="/dist/styles.css" rel="stylesheet">
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
  <div class="p-8 bg-white rounded shadow-lg text-center">
    <h1 class="text-2xl font-bold mb-4">Hello, Tailwind!</h1>
    <p class="text-gray-700">This is a simple example using Tailwind CSS utilities.</p>
    <button class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Click Me</button>
  </div>
</body>
</html>

Responsive Design & Breakpoints

Tailwind sets default breakpoints like sm, md, lg, xl, etc.

<div class="p-4 border border-gray-300 sm:p-8 md:p-12 lg:p-16 xl:p-20">
  <p class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
    Resize the window to see padding and text size change at different breakpoints.
  </p>
</div>

Hover, Focus & Other State Variants

<button class="bg-green-500 text-white font-semibold py-2 px-4 rounded 
               hover:bg-green-600 focus:ring-2 focus:ring-green-300 active:bg-green-700">
  Interactive Button
</button>

These state variants (hover:, focus:, active:, etc.) are applied as prefixes to utility classes.

Dark Mode Configuration

Enable dark mode in tailwind.config.js:

module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}

Using Dark Mode Classes in HTML:

<html class="dark">
<body class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  <h1 class="text-xl">Dark Mode Example</h1>
  <p class="mt-2">Toggle the .dark class on the HTML element to switch themes.</p>
</body>
</html>

Customizing the Theme

Extend the default Tailwind theme in tailwind.config.js:

module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#3fbaeb',
          DEFAULT: '#0fa9e6',
          dark: '#0c87b8'
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui']
      }
    }
  }
}

Now you can use these custom utilities:

<div class="bg-brand p-72 font-sans text-white">
  <h2 class="text-4xl">Custom Themed Section</h2>
</div>

Custom Breakpoints & Screens

// In tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      ... // keep default screens by spreading the default or define custom entirely
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  }
}

Use these breakpoints in HTML:

<p class="text-base xs:text-lg md:text-xl xl:text-3xl">
  This text size changes at custom breakpoints.
</p>

Adding & Using Plugins

Create a plugin that adds custom utilities in tailwind.config.js:

module.exports = {
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.skew-20deg': {
          transform: 'skewY(-20deg)'
        },
        '.skew-10deg': {
          transform: 'skewY(-10deg)'
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ]
}

Use in HTML:

<div class="skew-20deg hover:skew-10deg bg-blue-200 p-8">
  <p class="text-xl">Skewed Element</p>
</div>

Using @apply in CSS for Pattern Extraction

In src/components/button.css:

.btn {
  @apply px-4 py-2 rounded font-semibold bg-indigo-500 text-white hover:bg-indigo-600;
}

Then in HTML:

<button class="btn">Reusable Button</button>

This extracts frequently used utilities into a single reusable class.

Configuring Variants

Enable additional variants for certain utilities in tailwind.config.js:

module.exports = {
  variants: {
    extend: {
      backgroundColor: ['active', 'group-hover'],
      display: ['group-hover'],
      textColor: ['focus-visible']
    }
  }
}

Use group-hover & active variants:

<div class="group inline-block relative">
  <button class="bg-gray-700 text-white px-4 py-2 focus-visible:text-yellow-400">
    Menu
  </button>
  <div class="absolute hidden group-hover:block bg-white border border-gray-300">
    <a href="#" class="block px-4 py-2 hover:bg-gray-200 active:bg-gray-300">Item 1</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-200 active:bg-gray-300">Item 2</a>
  </div>
</div>

JIT Mode (Just-In-Time Compiler)

In Tailwind v2.1+, enable JIT in your config:

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.html'],
  theme: { /* ... */ },
  variants: { /* ... */ },
  plugins: [],
}

Now, arbitrary values and classes can be generated on-the-fly:

<div class="bg-[#1da1f2] text-[16px] p-[10px] rounded-[8px]">JIT Mode Example</div>

Extracting Components & Utilities Using @layer

src/styles/components.css:

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .card {
    @apply bg-white rounded-lg shadow p-4;
  }
  .card-header {
    @apply font-semibold text-lg mb-2;
  }
  .card-body {
    @apply text-gray-700;
  }
}

HTML Usage:

<div class="card">
  <h2 class="card-header">Card Title</h2>
  <p class="card-body">Card Content</p>
</div>

Customizing Fonts & Typography

Install typography plugin:

npm install @tailwindcss/typography

tailwind.config.js:

module.exports = {
  plugins: [
    require('@tailwindcss/typography')
  ]
}

Using Prose Classes:

<article class="prose lg:prose-xl">
  <h1>The Title</h1>
  <p>This is a paragraph with automatically styled typography.</p>
  <ul>
    <li>Stylish list item</li>
    <li>Another item</li>
  </ul>
</article>

Animations & Transitions

Tailwind provides classes for transitions and can be extended for custom animations.

Add a custom animation in tailwind.config.js:

module.exports = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    }
  }
}

Use the animation:

<div class="w-16 h-16 bg-red-500 animate-spin-slow"></div>

Transitions & Transforms:

<button class="transform transition duration-500 hover:scale-110 hover:rotate-6 bg-pink-500 text-white px-4 py-2">
  Hover to animate
</button>

Customizing the Color Palette

Replace the default color palette entirely if desired:

module.exports = {
  theme: {
    colors: {
      primary: '#1a202c',
      secondary: '#2d3748',
      accent: '#f56565',
      white: '#ffffff',
      black: '#000000'
    }
  }
}

Usage:

<div class="bg-primary text-white p-6">
  <h2 class="text-accent">Custom Colors</h2>
  <p class="text-secondary">This text uses a custom secondary color.</p>
</div>

Handling Forms & The @tailwindcss/forms Plugin

npm install @tailwindcss/forms

tailwind.config.js:

module.exports = {
  plugins: [
    require('@tailwindcss/forms')
  ]
}

HTML Usage:

<form class="space-y-4">
  <label class="block">
    <span class="text-gray-700">Email</span>
    <input type="email" class="mt-1 block w-full" placeholder="john@example.com"/>
  </label>
  <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit</button>
</form>

Grid & Flex Layout Examples

Responsive Grid:

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="bg-gray-100 p-4">Item 1</div>
  <div class="bg-gray-200 p-4">Item 2</div>
  <div class="bg-gray-300 p-4">Item 3</div>
  <div class="bg-gray-400 p-4">Item 4</div>
</div>

Flex Utilities:

<div class="flex items-center justify-between bg-blue-50 p-4">
  <span class="font-bold">Brand</span>
  <nav class="space-x-4">
    <a href="#" class="text-blue-700 hover:text-blue-900">Home</a>
    <a href="#" class="text-blue-700 hover:text-blue-900">About</a>
  </nav>
</div>

Advanced Purge (Content) Configuration

Optimize production builds by specifying templates:

module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  // ...
}

This ensures unused utilities are removed in production.

Using CSS Variables & Custom Properties

:root {
  --card-bg: #f7fafc;
}

.card {
  background-color: var(--card-bg);
  @apply rounded-xl shadow p-6;
}

HTML:

<div class="card">
  <h3 class="text-xl font-semibold">Custom Variable Card</h3>
  <p class="text-gray-600">Using custom CSS variable for background.</p>
</div>

Form Control Styling & Accessibility

<label class="block mb-2 font-medium text-gray-700" for="username">Username</label>
<input id="username" name="username" type="text" 
       class="block w-full border-gray-300 rounded-md shadow-sm 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />

Layering Utilities with @layer Directives

You can define utilities in layers to ensure proper ordering:

@layer utilities {
  .highlight {
    @apply bg-yellow-200 text-yellow-900 font-bold;
  }
}

Use:

<p class="highlight">This text is highlighted using a custom utility.</p>

Integrating with Frameworks (e.g., Next.js)

pages/_app.js in a Next.js project:

import '../styles.css' // includes @tailwind directives

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
export default MyApp

Tailwind classes will now work in your Next.js pages/components.

Handling Container Classes

Tailwind’s container class can be customized:

// tailwind.config.js
module.exports = {
  theme: {
    container: {
      center: true,
      padding: '2rem'
    }
  }
}

<div class="container bg-white mx-auto">
  <h1 class="text-3xl">Centered & Padded Container</h1>
</div>

Optimizing the Developer Experience

Use IntelliSense extensions and JIT mode for instant feedback.
Example (no code snippet here, but advice):
	•	Install Tailwind CSS IntelliSense in VSCode for class name suggestions.

These extensive examples and code snippets cover numerous aspects of Tailwind CSS v2 usage: from basic setup, customization, responsive design, variants, and dark mode, to plugins, layers, JIT mode, animations, typography plugin, forms, layout utilities, CSS variables, accessibility, and framework integration. This code-centric approach offers a rich reference for an AI agent to construct tasks, demos, and custom-tailored styling solutions using Tailwind CSS.`;
