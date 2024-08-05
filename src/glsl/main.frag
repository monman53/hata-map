#version 300 es
precision highp float;

in float id;
uniform int n2;

out vec4 outColor;

void main() {
    float alpha = 1.0f;
    float nid = id / float(1 << n2);
    vec3 color = vec3(nid, 1.0, nid);
    outColor = vec4(color, alpha);
}
