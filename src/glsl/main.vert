#version 300 es

uniform int n;
uniform ivec2 canvasSize;
uniform float scale;

uniform vec4 paramR0;
uniform vec4 paramI0;
uniform vec4 paramR1;
uniform vec4 paramI1;
uniform vec4 paramR2;
uniform vec4 paramI2;
uniform vec4 paramR3;
uniform vec4 paramI3;

uniform float t;

out float id;

vec2 mul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 comp(vec2 a) {
    return vec2(a.x, -a.y);
}

void main() {
    // Parameter Bezier
    vec4 paramR4 = (1.0 - t) * paramR0 + t * paramR1;
    vec4 paramI4 = (1.0 - t) * paramI0 + t * paramI1;

    vec4 paramR5 = (1.0 - t) * paramR1 + t * paramR2;
    vec4 paramI5 = (1.0 - t) * paramI1 + t * paramI2;

    vec4 paramR6 = (1.0 - t) * paramR2 + t * paramR3;
    vec4 paramI6 = (1.0 - t) * paramI2 + t * paramI3;

    // 

    vec4 paramR7 = (1.0 - t) * paramR4 + t * paramR5;
    vec4 paramI7 = (1.0 - t) * paramI4 + t * paramI5;

    vec4 paramR8 = (1.0 - t) * paramR5 + t * paramR6;
    vec4 paramI8 = (1.0 - t) * paramI5 + t * paramI6;

    // 

    vec4 paramR9 = (1.0 - t) * paramR7 + t * paramR8;
    vec4 paramI9 = (1.0 - t) * paramI7 + t * paramI8;

    // Parameters

    vec2 a = vec2(paramR9.x, paramI9.x);
    vec2 b = vec2(paramR9.y, paramI9.y);
    vec2 c = vec2(paramR9.z, paramI9.z);
    vec2 d = vec2(paramR9.w, paramI9.w);

    // Hata-map
    vec2 z = vec2(0.0f);
    int flag = gl_VertexID;
    for(int i = 0; i < n; i++) {
        if((flag & (1 << (i))) == 0) {
            // f1
            z = mul(a, z) + mul(b, comp(z));
        } else {
            // f2
            z = mul(c, vec2(z.x - 1.f, z.y)) + mul(d, vec2(z.x - 1.0f, -z.y)) + vec2(1.0f, 0.0f);
        }
    }

    vec2 pos = ((z - vec2(0.5f, 0.0f)) / vec2(canvasSize)) * scale;
    gl_Position = vec4(pos, 0.0f, 1.0f);
    gl_PointSize = 1.0f;

    id = float(gl_VertexID);
}