varying vec3 vUv;
uniform float uTime;
uniform vec2 uMouse;

// New uniforms for color modulation
uniform vec3 uColor1Base;
uniform float uColor1Frequency;
uniform float uColor1Amplitude;
uniform vec3 uColor2Base;
uniform float uColor2Frequency;
uniform float uColor2Amplitude;
uniform float uNoiseFactor;
uniform float uDistanceFactor;

void main() {
    // Normalized UV coordinates
    vec2 uv = vUv.xy * 0.5 + 0.5;

    // Time-varying parameters for color modulation
    float time1 = uTime * 0.1;
    float time2 = uTime * 0.2;

    // Create two smoothly varying color stops using sine and cosine
    vec3 color1 = uColor1Base + uColor1Amplitude * vec3(
        sin(time1 + uv.x * uColor1Frequency + uTime * 0.3),
        cos(time1 + uv.y * uColor1Frequency + uTime * 0.5),
        sin(time1 + (uv.x + uv.y) * uColor1Frequency * 0.7)
    );
    vec3 color2 = uColor2Base + uColor2Amplitude * vec3(
        sin(time2 + uv.x * uColor2Frequency + uTime * 0.2),
        cos(time2 + uv.y * uColor2Frequency + uTime * 0.4),
        cos(time2 + (uv.x + uv.y) * uColor2Frequency + uTime * 0.6)
    );

    // Blend the two colors based on a more distorted sine wave
    // Simple noise function
    float noise = fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
    float dist = distance(uv, uMouse);
    float blendFactor = noise - (uNoiseFactor / (dist * uDistanceFactor + 1.0));
    blendFactor = clamp(blendFactor, 0.0, 1.0);
    vec3 finalColor = mix(color1, color2, blendFactor);

    gl_FragColor = vec4(finalColor, 1.0);
}
