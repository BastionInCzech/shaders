uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
const float grid_size = 5.;

float random(float f)
{
	return fract(sin(f*10001.0)*105446.0);
}

float random(vec2 v)
{
	return abs(vec2(random(dot(v, 
		vec2(53, 4864)*6553.0)))).x;
}

vec2 random2(float f)
{
	return vec2(random(f),random(f));
}

vec2 random2(vec2 v)
{
	return abs(vec2(random(dot(v, 
		vec2(53, 4864)*6553.0))));
}

vec2 center(float xpos, float ypos)
{
	return random2(vec2(xpos, ypos)) + vec2(sin(u_time)*random(xpos), cos(u_time)*random(ypos));
}

vec2 base_center(vec2 center)
{
	return center - vec2(sin(u_time)*random(xpos), cos(u_time)*random(ypos));
}

vec4 center_color(vec2 center)
{
	return vec4(random(center.x), random(center.y), random(center), 1.);	
}
void main(){
	
	vec2 UV = gl_FragCoord.xy/u_resolution.xy;
    UV *= u_resolution.x/u_resolution.y;

    float xpos = floor(UV.x*grid_size);
    float ypos = floor(UV.y*grid_size);

    vec2 uvfract = fract(UV*grid_size);

    float mdist = 10.;
    vec2 mcenter;
    for (int xoff = -2; xoff  <3; xoff++) for (int yoff = -2; yoff < 3; yoff++)
    {
    	vec2 icenter = center(xpos + float(xoff), ypos + float(yoff)) + vec2(xoff, yoff);
    	if (distance(icenter, uvfract) < mdist)
    	{
    		mdist = distance(icenter, uvfract);
    		mcenter = icenter + vec2(xpos, ypos);

    	}
    }


  
    gl_FragColor = center_color(base_center(mcenter));
    //gl_FragColor = vec4(vec3(mcenter.x/20.0), 1.0);
}