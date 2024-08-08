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

void main() {
    // Parameter Bezier
    float s = smoothstep(0.f, 1.f, t);
    s = smoothstep(0.f, 1.f, s);
    s = smoothstep(0., 1., s);
    mat4x2 param4 = (1.0f - s) * param0 + s * param1;
    mat4x2 param5 = (1.0f - s) * param1 + s * param2;
    mat4x2 param6 = (1.0f - s) * param2 + s * param3;

    mat4x2 param7 = (1.0f - s) * param4 + s * param5;
    mat4x2 param8 = (1.0f - s) * param5 + s * param6;

    mat4x2 param9 = (1.0f - s) * param7 + s * param8;

    // Parameters
    vec2 a = param9[0];
    vec2 b = param9[1];
    vec2 c = param9[2];
    vec2 d = param9[3];

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