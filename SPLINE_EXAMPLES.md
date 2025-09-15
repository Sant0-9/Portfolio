# Spline Integration Examples

## Basic Usage
```jsx
<SplineScene
  scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
  className="w-full h-full"
/>
```

## With Custom Fallback
```jsx
<SplineScene
  scene="your-scene-url"
  fallback={
    <div className="custom-loading">
      <h3>Loading Amazing 3D Scene...</h3>
    </div>
  }
/>
```

## Multiple Scenes (Conditional)
```jsx
const scenes = {
  robot: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
  abstract: "https://prod.spline.design/uvmqrAkcqyqz0Bt3/scene.splinecode",
  laptop: "https://prod.spline.design/JNr1mQxfQGEKs6Q9/scene.splinecode"
};

<SplineScene scene={scenes.robot} />
```

## Popular Spline Template Categories:

### Characters & Avatars
- Robots and androids
- Cartoon characters
- Abstract humanoid figures

### Tech & Gadgets
- Laptops and computers
- Smartphones and tablets
- Gaming consoles
- VR headsets

### Abstract & Artistic
- Geometric shapes
- Floating objects
- Particle systems
- Abstract landscapes

### Nature & Environment
- Planets and space scenes
- Trees and plants
- Weather effects
- Terrain and landscapes

## Performance Tips:

1. **Optimize Scenes**: Keep polygon count reasonable for web
2. **Preload**: Spline scenes load asynchronously
3. **Fallbacks**: Always provide loading states
4. **Mobile**: Test on mobile devices for performance
5. **File Size**: Larger scenes take longer to load

## Troubleshooting:

- **Scene not loading**: Check the URL is correct and public
- **Performance issues**: Reduce scene complexity
- **Mobile problems**: Test viewport settings
- **CORS errors**: Ensure scene is exported for web

## Next Steps:

1. Visit spline.design and explore templates
2. Find a scene you like and get its URL
3. Replace the URL in your page.tsx
4. Test loading and performance
5. Customize the scene if needed