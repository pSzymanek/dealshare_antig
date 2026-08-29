"use client";

import { useEffect, useRef } from "react";

type MagentaRibbonsProps = {
  className?: string;
};

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 u_resolution;
  uniform float u_time;

  // Pseudo-random hash
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Smooth value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractional Brownian Motion (FBM) for realistic cosmic dust clouds
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.877, 0.479, -0.479, 0.877);
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.05 + vec2(1.2, 3.4);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    // Extremely slow, calm celestial drift
    float t = u_time * 0.035;

    // Smooth edge vignette so nebula fades gracefully at screen boundaries
    float edgeFade = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);

    // ==============================================
    // --- NEBULA ARM 1 (Top / Hero Wave - MAGENTA) ---
    // ==============================================
    float x1 = uv.x * 2.4 - 0.2;
    float wave1 = sin(x1 * 0.95 - t * 0.6) * 0.15 
                + cos(x1 * 1.7 + t * 0.4) * 0.05;
    float curveY1 = 0.70 + wave1; // Top half of screen
    float dist1 = abs(uv.y - curveY1);

    // Domain-warped gaseous density for organic celestial clouds
    vec2 dustCoord1 = vec2(uv.x * 2.8 - t * 0.15, uv.y * 3.6 + t * 0.08);
    float cloud1 = fbm(dustCoord1 + fbm(dustCoord1 * 1.5));

    // Balanced midpoint intensity: soft, slender & luminous
    float nebGlowWide1 = exp(-dist1 * (6.0 + cloud1 * 1.8)) * 0.18;
    float nebGlowMed1  = exp(-dist1 * (16.5 + cloud1 * 3.8)) * (0.28 + cloud1 * 0.28);
    float nebCore1     = exp(-dist1 * (48.0 + cloud1 * 9.0)) * (0.24 + cloud1 * 0.24);
    float totalArm1    = (nebGlowWide1 + nebGlowMed1 + nebCore1) * edgeFade;

    // ==================================================
    // --- NEBULA ARM 2 (Bottom / Benefits Wave - CYAN) ---
    // ==================================================
    float x2 = uv.x * 2.6 + 0.4;
    float wave2 = sin(x2 * 0.85 + t * 0.5 + 2.2) * 0.13 
                + cos(x2 * 1.6 - t * 0.3) * 0.04;
    float curveY2 = 0.36 + wave2; // Bottom half of screen ("pod spodem")
    float dist2 = abs(uv.y - curveY2);

    vec2 dustCoord2 = vec2(uv.x * 2.5 + t * 0.12, uv.y * 3.2 - t * 0.07);
    float cloud2 = fbm(dustCoord2 + fbm(dustCoord2 * 1.4));

    float nebGlowWide2 = exp(-dist2 * (6.2 + cloud2 * 1.8)) * 0.16;
    float nebGlowMed2  = exp(-dist2 * (17.5 + cloud2 * 3.8)) * (0.26 + cloud2 * 0.26);
    float nebCore2     = exp(-dist2 * (50.0 + cloud2 * 9.0)) * (0.22 + cloud2 * 0.22);
    float totalArm2    = (nebGlowWide2 + nebGlowMed2 + nebCore2) * edgeFade;

    // ==========================================
    // --- COLOR PALETTE: MAGENTA & CYAN ---
    // ==========================================
    // Top Arm: Electric Neon Magenta & Pink
    vec3 c_magDeep  = vec3(0.48, 0.00, 0.26);
    vec3 c_magNeon  = vec3(1.00, 0.00, 0.58);
    vec3 c_magLight = vec3(1.00, 0.42, 0.80);
    vec3 c_magCore  = vec3(1.00, 0.90, 0.97);

    // Bottom Arm: Electric Neon Cyan & Teal
    vec3 c_cyanDeep  = vec3(0.00, 0.32, 0.40);
    vec3 c_cyanNeon  = vec3(0.00, 0.85, 1.00); // Dealshare Cyan
    vec3 c_cyanLight = vec3(0.35, 0.98, 0.92);
    vec3 c_cyanCore  = vec3(0.88, 1.00, 1.00);

    // Composite Arm 1 (Top Magenta)
    vec3 col = vec3(0.0);
    col += c_magDeep  * (nebGlowWide1 * edgeFade * 0.78);
    col += c_magNeon  * (nebGlowMed1 * edgeFade * 0.85);
    col += c_magLight * (nebCore1 * edgeFade * 0.75);
    col += c_magCore  * (nebCore1 * edgeFade * cloud1 * 0.30);

    // Composite Arm 2 (Bottom Cyan)
    col += c_cyanDeep  * (nebGlowWide2 * edgeFade * 0.72);
    col += c_cyanNeon  * (nebGlowMed2 * edgeFade * 0.80);
    col += c_cyanLight * (nebCore2 * edgeFade * 0.70);
    col += c_cyanCore  * (nebCore2 * edgeFade * cloud2 * 0.25);

    // Microscopic stardust
    float totalEnergy = totalArm1 + totalArm2;
    if (totalEnergy > 0.004) {
      float stardust = hash(uv * u_resolution * 0.85 + fract(u_time * 0.015));
      col += col * (stardust * 0.08);
    }

    // Perfectly balanced midpoint opacity
    float alpha = clamp(totalEnergy * 0.70, 0.0, 0.68);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function MagentaRibbons({ className = "" }: MagentaRibbonsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "high-performance" }) ||
      (canvas.getContext("experimental-webgl", { alpha: true }) as WebGLRenderingContext | null);

    if (!gl) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function createShader(type: number, source: string): WebGLShader | null {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Luminous additive blend

    let width = 0;
    let height = 0;
    let frameId = 0;
    let isVisible = true;
    const startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = () => {
      frameId = window.requestAnimationFrame(render);
      if (!isVisible) return;

      const elapsed = reducedMotion ? 1.0 : (performance.now() - startTime) * 0.001;

      gl.uniform2f(resLocation, width, height);
      gl.uniform1f(timeLocation, elapsed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (reducedMotion) {
        window.cancelAnimationFrame(frameId);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });

    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    resize();
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (vertShader) gl.deleteShader(vertShader);
      if (fragShader) gl.deleteShader(fragShader);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
