# Solar System Portfolio - Detailed Requirements & Vision

Status: 3D ready

A cinematic 3D portfolio website where projects orbit as planets around a central sun, with immersive scroll-based interactions and animations.

## 🎬 **Cinematic User Experience Vision**

### **Initial Load State**
- User lands on a black space background with distant, barely visible solar system
- **"Solar Portfolio" title** prominently displayed in center with subtitle
- **"Explore Projects" and "About Me" buttons** visible below title
- Solar system elements (sun, orbiting planets, stars) visible but distant and subtle
- Navbar fixed at top with transparent background

### **The Scroll Journey - Phase 1: Title Departure (0-30% scroll)**
**What should happen:**
- **Title Animation**: "Solar Portfolio" and subtitle fade out with upward movement
- **Button Animation**: "Explore Projects" and "About Me" buttons fade away
- **Camera State**: Remains distant, solar system still far away
- **Visual Effect**: User feels like they're about to embark on a space journey

### **The Scroll Journey - Phase 2: Approaching Solar System (30-70% scroll)**
**What should happen:**
- **Camera Movement**: Dramatically approaches the solar system (Z: 1200 → 400)
- **Orbital Motion**: Planets become clearly visible, orbiting the sun
- **Starfield**: Background stars become more prominent and parallax-scrolling
- **Sun Glow**: Central sun becomes brighter and more prominent
- **Planet Visibility**: Individual planets become distinguishable with their unique colors

### **The Scroll Journey - Phase 3: Planet Interaction Zone (70-100% scroll)**
**What should happen:**
- **Close Approach**: Camera moves very close to the orbital rings (Z: 400 → 200)
- **Planet Interaction**: 
  - Planets become large and clearly interactive
  - **Hover Effects**: Hovering over planets shows project tooltips
  - Tooltips display: Project name, description, tech stack tags
  - Planet gets subtle glow/highlight when hovered
- **Orbital Dynamics**: Planets continue smooth orbital motion
- **Sun Access**: Sun becomes clickable to reveal "About Me" section

### **Interactive Elements**

#### **Planet Hover System**
- **Trigger**: Mouse hover over planet (desktop) or tap (mobile)
- **Tooltip Content**:
  - Project name as header
  - One-line description
  - Technology tags with project-color theming
  - Subtle animation on appearance
- **Visual Feedback**: 
  - Planet scale increases slightly
  - Soft glow effect around planet
  - Tooltip appears near planet without blocking view

#### **Sun Click System**
- **Trigger**: Click/tap the central sun
- **Action**: Opens modal overlay with "About Me" content
- **Modal Features**:
  - Accessible (focus trap, ESC to close, backdrop click)
  - Contains: Personal bio, skills grid, contact info
  - Animated entrance with backdrop blur
  - Professional styling matching space theme

## 🎯 **Technical Implementation Requirements**

### **Scroll Detection & Camera Control**
- Use Framer Motion's `useScroll` with section targeting
- Smooth camera interpolation using `THREE.MathUtils.lerp`
- Responsive scroll ranges that work across different screen sizes
- No performance issues - maintain 60fps during scroll

### **3D Scene Architecture**
- **Canvas Setup**: React Three Fiber with performance optimizations
- **Camera**: Perspective camera with smooth position transitions
- **Lighting**: Point light from sun + ambient for visibility
- **Stars**: Instanced particles for performance (2 depth layers)
- **Planets**: Low-poly spheres with project-themed materials
- **Orbits**: Wireframe rings indicating orbital paths

### **Responsive Design**
- **Mobile**: Reduce planet count to 3, disable mouse parallax
- **Tablet**: Maintain all features with touch-friendly interactions
- **Desktop**: Full experience with mouse hover effects
- **Performance**: Adjust particle counts based on device capabilities

### **Accessibility Standards**
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respect `prefers-reduced-motion` setting
- **Color Contrast**: Maintain WCAG AA compliance
- **Focus Management**: Clear focus indicators and logical tab order

### **Animation Performance**
- **Smooth Scrolling**: No janky or stuttering animations
- **GPU Acceleration**: Use CSS transforms and WebGL efficiently
- **Memory Management**: Clean up Three.js resources properly
- **Progressive Enhancement**: Basic experience without JavaScript

## 📊 **Project Data Structure**

```typescript
interface Project {
  id: string
  name: string
  description: string // One-line description for tooltip
  tags: string[] // Technology stack
  color: string // Hex color for planet and theming
  orbit: number // Orbital radius multiplier (2.0-4.0)
  demo?: string // Live demo URL
  github?: string // GitHub repository URL
}
```

### **Current Projects**
1. **Tripwise** (Teal planet)
   - AI-powered travel planning with RAG integration
   - Tags: RAG, Maps, Next.js
   - Orbit: 2.2 (closest to sun)

2. **LifeOS** (Purple planet)
   - Personal AI agent system with memory
   - Tags: Agents, Memory
   - Orbit: 3.0 (middle orbit)

3. **Barta** (Orange planet)
   - Bangla news aggregation using RAG
   - Tags: Bangla, News, RAG
   - Orbit: 3.8 (furthest orbit)

## 🎨 **Visual Design Specifications**

### **Color Palette**
- **Background**: Pure black (#000000)
- **Text**: Zinc-200 (#e4e4e7) for primary text
- **Accent**: Zinc-300 (#d4d4d8) for secondary text
- **Interactive**: White with transparency for buttons
- **Planet Colors**: Project-specific hex colors from data

### **Typography**
- **Font Family**: Geist Sans (primary), Geist Mono (code/debug)
- **Title**: 5xl-8xl responsive sizing with gradient text effect
- **Body**: xl-2xl for descriptions, responsive scaling
- **UI Elements**: sm-base for buttons and navigation

### **Spacing & Layout**
- **Hero Section**: 400vh height for long scroll experience
- **Viewport**: Sticky positioning for 3D canvas
- **Content**: Centered with max-width constraints
- **Padding**: Responsive padding that works on all devices

## 🔧 **Development Guidelines**

### **Performance Targets**
- **Frame Rate**: Maintain 60fps during scroll animations
- **Bundle Size**: Keep initial load under 500KB
- **Lighthouse Scores**: 90+ for Performance, Accessibility, SEO
- **Load Time**: First meaningful paint under 2 seconds

### **Browser Support**
- **Modern Browsers**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **WebGL**: Requires WebGL 2.0 support
- **Fallbacks**: Provide degraded experience for unsupported browsers

### **Code Quality**
- **TypeScript**: Full type safety throughout
- **ESLint**: No warnings or errors
- **Accessibility**: WCAG AA compliance
- **Testing**: Core functionality should be testable

## 📱 **Mobile Experience Adaptations**

### **Touch Interactions**
- **Planet Tap**: Replace hover with tap-to-show tooltip
- **Tooltip Dismissal**: Tap outside or tap another element to close
- **Sun Interaction**: Large touch target for about modal
- **Scroll Performance**: Optimized for touch scrolling

### **Performance Optimizations**
- **Reduced Particles**: Lower star field density
- **Simplified Effects**: Disable complex animations if needed
- **Battery Consideration**: Monitor and optimize power usage

## 🎪 **Animation Sequences**

### **Page Load Animation**
1. Fade in starfield background
2. Slide in "Solar Portfolio" title from bottom
3. Fade in subtitle and buttons
4. Subtle orbital motion begins

### **Scroll Transition Phases**
1. **Phase 1 (0-30%)**: Title fade-out with upward movement
2. **Phase 2 (30-70%)**: Camera approach with increasing planet visibility
3. **Phase 3 (70-100%)**: Close interaction with hover tooltips active

### **Micro-Interactions**
- **Planet Hover**: Scale up + glow + tooltip slide-in
- **Button Hover**: Background opacity change + border glow
- **Sun Hover**: Brightness increase + scale pulse
- **Tooltip**: Smooth fade + subtle slide animation

## 🚀 **Deployment & Production**

### **Build Optimization**
- **Code Splitting**: Dynamic imports for 3D components
- **Asset Optimization**: Compress textures and models
- **CDN Integration**: Serve static assets from CDN
- **Caching Strategy**: Proper cache headers for performance

### **Monitoring & Analytics**
- **Performance Tracking**: Monitor FPS and load times
- **User Interaction**: Track planet hovers and sun clicks
- **Error Handling**: Graceful fallbacks for WebGL issues
- **A/B Testing**: Test different camera movement speeds

## 🎯 **Success Criteria**

### **User Experience**
- [ ] Smooth, cinematic scroll experience from distant to close view
- [ ] Intuitive planet interactions with informative tooltips
- [ ] Seamless transition between different scroll phases
- [ ] Accessible experience across all devices and assistive technologies

### **Technical Performance**
- [ ] 60fps maintained during all scroll animations
- [ ] No layout shifts or visual glitches
- [ ] Fast initial load with progressive enhancement
- [ ] Clean console with no errors or warnings

### **Content Delivery**
- [ ] All project information clearly accessible
- [ ] About section easily discoverable via sun interaction
- [ ] Professional presentation matching portfolio standards
- [ ] SEO-friendly with proper meta tags and structure

---

*This README serves as the complete specification for the Solar System Portfolio. All implementation should align with these requirements to deliver the intended cinematic space journey experience.*
