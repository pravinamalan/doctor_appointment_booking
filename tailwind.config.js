/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './resources/**/*.blade.php',
      './resources/**/*.js',
      './resources/**/*.jsx',
    ],
    theme: {
        extend: {
            screens: {
                'xs': '425px',
                // => @media (min-width: 425px) { ... }
            },
            colors:{
                'primary' : "#5f6FFF"
            },
            gridTemplateColumns:{
                'auto' : 'repeat(auto-fill, minmax(200px,1fr))'
            }
        },
    },
    plugins: [],
}
