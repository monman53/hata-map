#version 300 es

uniform int n;
uniform ivec2 canvasSize;
uniform float prevScale;
uniform float scale;
uniform vec2 prevCenter;
uniform vec2 center;
uniform float pointSize;

uniform mat4x2 param0;
uniform mat4x2 param1;
uniform mat4x2 param2;
uniform mat4x2 param3;

uniform float t;

out float colorScale;

vec2 mul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 comp(vec2 a) {
    return vec2(a.x, -a.y);
}

float closeTheta(float a, float b) {
    float pi = acos(-1.f);
    if(a > b) {
        if(a - b >= pi) {
            return b + 2.f * pi;
        }
    } else {
        if(b - a >= pi) {
            return b - 2.f * pi;
        }
    }

    return b;
}

void main() {
    // Parameter Bezier
    float s = t;
    s = smoothstep(0.f, 1.f, t);
    s = smoothstep(0.f, 1.f, s);
    s = smoothstep(0.f, 1.f, s);
    // mat4x2 param4 = (1.0f - s) * param0 + s * param1;
    // mat4x2 param5 = (1.0f - s) * param1 + s * param2;
    // mat4x2 param6 = (1.0f - s) * param2 + s * param3;

    // mat4x2 param7 = (1.0f - s) * param4 + s * param5;
    // mat4x2 param8 = (1.0f - s) * param5 + s * param6;

    // mat4x2 param9 = (1.0f - s) * param7 + s * param8;

    // // Parameters
    // vec2 a = param9[0];
    // vec2 b = param9[1];
    // vec2 c = param9[2];
    // vec2 d = param9[3];

    vec2 a0 = param0[0];
    vec2 b0 = param0[1];
    vec2 c0 = param0[2];
    vec2 d0 = param0[3];
    vec2 a1 = param3[0];
    vec2 b1 = param3[1];
    vec2 c1 = param3[2];
    vec2 d1 = param3[3];

    float a0t = atan(a0.y, a0.x);
    float b0t = atan(b0.y, b0.x);
    float c0t = atan(c0.y, c0.x);
    float d0t = atan(d0.y, d0.x);
    float a1t = atan(a1.y, a1.x);
    float b1t = atan(b1.y, b1.x);
    float c1t = atan(c1.y, c1.x);
    float d1t = atan(d1.y, d1.x);

    float ar = mix(length(a0), length(a1), s);
    float br = mix(length(b0), length(b1), s);
    float cr = mix(length(c0), length(c1), s);
    float dr = mix(length(d0), length(d1), s);
    float at = mix(a0t, closeTheta(a0t, a1t), s);
    float bt = mix(b0t, closeTheta(b0t, b1t), s);
    float ct = mix(c0t, closeTheta(c0t, c1t), s);
    float dt = mix(d0t, closeTheta(d0t, d1t), s);

    vec2 a = ar * vec2(cos(at), sin(at));
    vec2 b = br * vec2(cos(bt), sin(bt));
    vec2 c = cr * vec2(cos(ct), sin(ct));
    vec2 d = dr * vec2(cos(dt), sin(dt));

    // Hata-map
    vec2 z = vec2(0.0f);
    int flag = gl_VertexID;
    for(int i = 0; i < n; i++) {
        if((flag & (1 << i)) == 0) {
            // f1
            z = mul(a, z) + mul(b, comp(z));
        } else {
            // f2
            z = mul(c, vec2(z.x - 1.f, z.y)) + mul(d, vec2(z.x - 1.0f, -z.y)) + vec2(1.0f, 0.0f);
        }
    }

    s = smoothstep(0.f, 1.f, s);
    float currentScale = mix(prevScale, scale, s);
    vec2 currentCenter = mix(prevCenter, center, vec2(s));

    vec2 aspect = 1.0f / vec2(canvasSize);
    vec2 pos = (z - currentCenter) * aspect * currentScale;
    gl_Position = vec4(pos, 0.0f, 1.0f);
    gl_PointSize = 1.0f * currentScale / 2000.f * pointSize;

    int id = gl_VertexID;
    int m = 0;
    colorScale = float(id % (1 << (n - m))) / float(1 << (n - m));
}