import React, { useEffect, useRef } from 'react';

export const CosmicShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let gl: WebGLRenderingContext | null = null;

    try {
      gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ; m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float starSparkle(vec2 uv, vec2 center, float size, float flareIntensity, float timeOffset) {
    vec2 d = abs(uv - center);
    float pulse = sin(u_time * 2.2 + timeOffset) * 0.45 + 0.55;
    float crossGlow = (0.0018 * size * pulse) / (d.x + 0.003) * (0.0018 * size * pulse) / (d.y + 0.003);
    float core = smoothstep(0.035 * size * pulse, 0.0, length(uv - center));
    return (core * 2.2 + crossGlow * flareIntensity);
}

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.22;

    float n1 = snoise(p * 2.2 + vec2(t * 0.35, -t * 0.25));
    float n2 = snoise(p * 4.6 - vec2(t * 0.2, t * 0.4) + n1 * 0.55);
    float n3 = snoise(p * 8.5 + vec2(-t * 0.15, t * 0.2) + n2 * 0.35);

    float dist = length(p);

    vec3 colDeepSpace    = vec3(0.035, 0.025, 0.075);
    vec3 colMysticViolet = vec3(0.380, 0.120, 0.650);
    vec3 colAuroraCyan   = vec3(0.000, 0.920, 0.980);
    vec3 colGoldSparkle  = vec3(1.000, 0.880, 0.420);
    vec3 colDiamondWhite = vec3(0.960, 0.980, 1.000);

    float blendVal = clamp(n1 * 0.5 + n2 * 0.35 + n3 * 0.15 + (1.0 - dist * 1.3), 0.0, 1.0);
    vec3 col = colDeepSpace;
    col = mix(col, colMysticViolet, smoothstep(0.15, 0.65, blendVal) * 0.7);
    col = mix(col, colAuroraCyan, smoothstep(0.55, 0.95, blendVal) * 0.65);

    float coreLight = exp(-dist * 3.4) * 0.75;
    col += colAuroraCyan * coreLight * 0.5;
    col += colGoldSparkle * (coreLight * coreLight * 0.9);

    float microStars1 = pow(max(0.0, snoise(p * 32.0 + t * 0.8)), 8.0) * 2.2;
    float microStars2 = pow(max(0.0, snoise(p * 55.0 - t * 1.1 + vec2(4.2, 8.1))), 9.0) * 3.0;
    col += mix(colGoldSparkle, colDiamondWhite, 0.6) * (microStars1 + microStars2);

    float stars = 0.0;
    stars += starSparkle(p, vec2(-0.35, 0.42), 1.2, 0.9, 0.0);
    stars += starSparkle(p, vec2(0.38, 0.48), 1.0, 0.8, 1.8);
    stars += starSparkle(p, vec2(0.0, 0.28), 1.5, 1.2, 3.2);
    stars += starSparkle(p, vec2(-0.42, -0.05), 0.9, 0.7, 4.5);
    stars += starSparkle(p, vec2(0.32, -0.38), 1.3, 1.0, 2.4);
    stars += starSparkle(p, vec2(-0.28, -0.45), 1.1, 0.8, 5.1);

    col += colGoldSparkle * stars * 0.85;
    col += colDiamondWhite * stars * 0.65;

    col *= smoothstep(1.3, 0.35, dist);

    gl_FragColor = vec4(col, 1.0);
}`;

    const compileShader = (type: number, src: string) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouse.x = event.clientX - rect.left;
        mouse.y = rect.height - (event.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const syncSize = () => {
      if (!canvas || !gl) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    syncSize();
    window.addEventListener('resize', syncSize);

    const render = (t: number) => {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', syncSize);
    };
  }, []);

  return (
    <>
      {/* 1. WebGL Living Cosmic Nebula Shader */}
      <div className="cosmic-shader-container fixed inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden bg-[#090613] transition-colors duration-700">
        <canvas
          ref={canvasRef}
          className="cosmic-shader-canvas w-full h-full block opacity-85 transition-opacity duration-1000"
        />
        {/* Deep space vignette overlay */}
        <div className="cosmic-shader-vignette absolute inset-0 bg-gradient-to-b from-[#090613]/50 via-transparent to-[#090613]/80 pointer-events-none transition-all duration-700" />
      </div>

      {/* 2. Floating Ambient Stardust Particles Layer (CSS Foreground Glitter Overlays) */}
      <div className="cosmic-stardust-layer fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Cross Star Sparkle 1 */}
        <svg
          className="absolute top-20 left-8 w-6 h-6 text-[#f5d061] animate-star-pulse gold-stardust-glow"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
        </svg>

        {/* Cross Star Sparkle 2 */}
        <svg
          className="absolute top-44 right-6 w-5 h-5 text-white animate-star-pulse-delayed"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0 L13.2 9.2 L22.4 12 L13.2 14.8 L12 24 L10.8 14.8 L1.6 12 L10.8 9.2 Z" />
        </svg>

        {/* Cross Star Sparkle 3 */}
        <svg
          className="absolute top-[38%] left-4 w-4 h-4 text-[#ffe06b] animate-star-pulse-fast gold-stardust-glow"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
        </svg>

        {/* Cross Star Sparkle 4 */}
        <svg
          className="absolute top-[62%] right-5 w-7 h-7 text-[#f5d061] animate-star-pulse"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0 L13.8 9.2 L23 12 L13.8 14.8 L12 24 L10.2 14.8 L1 12 L10.2 9.2 Z" />
        </svg>

        {/* Cross Star Sparkle 5 */}
        <svg
          className="absolute bottom-32 left-10 w-5 h-5 text-white animate-star-pulse-delayed"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0 L13.2 9.2 L22.4 12 L13.2 14.8 L12 24 L10.8 14.8 L1.6 12 L10.8 9.2 Z" />
        </svg>

        {/* Floating Gold Dust Particles */}
        <span className="absolute top-28 left-1/3 w-1.5 h-1.5 rounded-full bg-[#f5d061] shadow-[0_0_8px_#f5d061] animate-glitter" />
        <span className="absolute top-64 right-1/4 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-glitter-rev" />
        <span className="absolute top-[48%] left-12 w-2 h-2 rounded-full bg-[#f5d061]/80 shadow-[0_0_10px_#f5d061] animate-glitter" />
        <span className="absolute top-[75%] right-16 w-1.5 h-1.5 rounded-full bg-[#00dce6] shadow-[0_0_8px_#00dce6] animate-glitter-rev" />
      </div>
    </>
  );
};
