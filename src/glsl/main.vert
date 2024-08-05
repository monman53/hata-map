#version 300 es

uniform int n;
uniform ivec2 canvasSize;
uniform vec2 a, b, c, d;
uniform float scale;

out float id;

vec2 mul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 comp(vec2 a) {
    return vec2(a.x, -a.y);
}

void main() {
    vec2 z = vec2(0.0f);
    int flag = gl_VertexID;
    for(int i = 0; i < n; i++) {
        if((flag & 1) == 0) {
            // f1
            z = mul(a, z) + mul(b, comp(z));
        } else {
            // f2
            z = mul(c, vec2(z.x - 1.f, z.y)) + mul(d, vec2(z.x - 1.0f, -z.y)) + vec2(1.0f, 0.0f);
        }
        flag >>= 1;
    }

    vec2 pos = ((z - vec2(0.5,0.0)) / vec2(canvasSize)) * scale;
    gl_Position = vec4(pos, 0.0f, 1.0f);
    gl_PointSize = 1.0f;

    id = float(gl_VertexID);
}