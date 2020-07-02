#ifdef GL_ES
precision mediump float;
#endif

#define ilightball lightball(st, spawns[i], dirs[i], speeds[i], sizes[i])

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int lightball_count = 50;

const vec3 letter_color = vec3(0.0, 0.0, 0.001);
//const vec3 letter_color = vec3(1.); //debug


vec2 spawns[lightball_count];
vec2 dirs[lightball_count];
float speeds[lightball_count];
float sizes[lightball_count];


float distanceToLine(vec2 p1, vec2 p2, vec2 point) {
    float a = p1.y-p2.y;
    float b = p2.x-p1.x;
    return abs(a*point.x+b*point.y+p1.x*p2.y-p2.x*p1.y) / sqrt(a*a+b*b);
}

vec3 line(vec2 st, vec2 a, vec2 b, float t)
{
    if (distanceToLine(a, b, st) < t && length(a-st) + length(b - st) < length(a-b) + t)
    {
        return vec3(1.);
    }
    else return vec3(0.);
}

vec3 O(vec2 st, vec2 center, float s)
{
    const float ofs = 0.07;
    const float thick = 0.3;
    const vec3 c = letter_color;
    if (abs(length(st-center+vec2(0., -ofs)) - s) < thick*s && st.y > center.y+ofs)
    {
        return c;
    }
    else if (abs(length(st-center+vec2(0., +ofs)) - s) < thick*s && st.y < center.y-ofs)
    {
        return c;
    }
    else if (abs(abs(st.x - center.x) - s) < thick*s && abs(st.y - center.y) < ofs)
    {
        return c;
    }
    else return vec3(0.0);
}

vec3 N(vec2 st, vec2 center, float s)
{
    vec3 r = vec3(0.);
    r += line(st, center + vec2(-0.5)*s, center + vec2(0.5)*s, 0.1*s);

    
    if (r != vec3(0.)){ 
        return letter_color;
        }
    else
        return r;  
}

float random(float n, float seed)
{
    return fract(sin(n)*100001. * seed);
}

vec3 lightball(vec2 st, vec2 spawn, vec2 dir, float speed, float size)
{   
    vec2 center = spawn + dir * speed * u_time;
    if (length(st-center) < size)
    {
        return vec3(0.2353, 0.2392, 0.0);
    }
    else
    {
        return vec3(0.0);
    }
}


vec2 closest_point(vec2 line_point, vec2 dir, vec2 point)
{
    return line_point + dir * dot(point - line_point, dir);
}
void main(){
    //Create list of lightball parameters
    
    for (int i = 0; i < lightball_count; i++)
    {
        spawns[i] = normalize(vec2((random(float(i), 1.0)-0.5), random(float(i), 0.9)-0.5)) + vec2(0.5);
        sizes[i] = random(float(i), 1.2)*0.05;
        speeds[i] = random(float(i), 1.3)*0.7;
        dirs[i] = vec2(0.5) - spawns[i] + 
            (vec2(random(float(i), 0.7), random(float(i), 0.75))-vec2(0.5))/2.;
    }
    vec2 st = gl_FragCoord.xy/u_resolution.x;
    vec3 O_val = O(st, vec2(0.5), 0.1);
    
    vec3 color = O_val;
    //color += lightball(st, vec2(0.2), vec2(1.), 0.5, 0.03);  

    //Draw lightball bodies
    for (int i = 0; i < lightball_count; i++){
        color += lightball(st, spawns[i], dirs[i], speeds[i], sizes[i]);
    }

    //Draw overlap
    for (int i = 0; i < lightball_count; i++){
        if (O_val != vec3(0.) && ilightball != vec3(0))
        {
            color = vec3(1.);
        }
    
        vec2 closest = closest_point(spawns[i], normalize(dirs[i]), st);
        if (length(closest - st) < sizes[i] && O_val != vec3(0))
        {
            vec3 light = vec3(1.) * (1.-length(spawns[i]+dirs[i]*u_time*speeds[i]-closest)/3./speeds[i]); 
            vec2 diff = spawns[i]+dirs[i]*u_time*speeds[i]-closest;
            vec2 v = diff / dirs[i];
            if (light.x > 0. && v.x > 0. && v.y > 0.)
            {
                color += light;
            }
        }
    }

    gl_FragColor = vec4(color, 1.0);

}