#version 300 es

uniform int n;
uniform ivec2 canvasSize;
uniform float scale;
uniform float pointSize;
uniform vec2 center;

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
    mat4x2 param4 = (1.0f - t) * param0 + t * param1;
    mat4x2 param5 = (1.0f - t) * param1 + t * param2;
    mat4x2 param6 = (1.0f - t) * param2 + t * param3;

    mat4x2 param7 = (1.0f - t) * param4 + t * param5;
    mat4x2 param8 = (1.0f - t) * param5 + t * param6;

    mat4x2 param9 = (1.0f - t) * param7 + t * param8;

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

    vec2 aspect = 1.0 / vec2(canvasSize);
    vec2 pos = (z - center) * aspect * scale;
    gl_Position = vec4(pos, 0.0f, 1.0f);
    gl_PointSize = 1.0f * scale / 2000. * pointSize;

    int id = gl_VertexID;
    int m = 0;
    colorScale = float(id % (1 << (n - m))) / float(1 << (n - m));
}