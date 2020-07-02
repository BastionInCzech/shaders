#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
const float speed_scale = 1.;
const vec2 pixels = vec2(50.0, 50.0);

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float fnoise(float x){
  float ret;
  const int octaves = 6;
  float lacunarity = 2.;
  float gain = 0.6;
  //
  // Initial values
  float amplitude = 0.5;
  float frequency = 1.;
  //
  // Loop of octaves
  for (int i = 0; i < octaves; i++) {
  	ret += amplitude * noise(vec2(frequency*x, 1.0));
  	frequency *= lacunarity;
  	amplitude *= gain;
  }
  return ret;
}

float fnoise2(float x)
{
  float ret;
  const int octaves = 2;
  float lacunarity = 8.;
  float gain = 1.0;
  //
  // Initial values
  float amplitude = 0.5;
  float frequency = 1.;
  //
  // Loop of octaves
  for (int i = 0; i < octaves; i++) {
    ret += amplitude * noise(vec2(frequency*x, 1.0));
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return ret;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.x;
    vec3 color;

    float y = floor(st.y*pixels.y) / pixels.y;
    float x = floor((st.x+u_time*speed_scale)*pixels.x) / pixels.x;
    float fx = floor((st.x+u_time*speed_scale*0.3)*pixels.x) / pixels.x;
    //float height = noise(vec2(st.x + u_time, 1.)*10.0);
    float far = fnoise(fx) + 0.1;
    float close = fnoise2(x) - 0.1;
    float snowline = -abs(sin(fx*2.))*0.1 + 0.8;
    if (y < close)
    {
      color = vec3(1.0, 128./255., 0.0);
      if (y > fnoise2(x-0.1) ||
      y > fnoise2(x+0.1) ||
      y + 0.1 > close) //Left side
      {
        color = vec3(0.8, 100./255., 0.0);
      }
    }
    else if (y < far)
    {
      color = vec3(82./255., 82./255., 122./255.);
      if (y > snowline)
      {
        color = vec3(1.0);
      }
    }
    else
    {
      color = vec3(51./255., 153./255., 1.);
    }

    gl_FragColor = vec4(color, 1.0);
}
