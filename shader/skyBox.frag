#version 460

in vec3 Vec;

layout(binding=4) uniform samplerCube SkyBoxTex;

layout (location = 0) out vec4 FragColor;


void main() {

    //set skybox color
    vec3 texColor = texture(SkyBoxTex, normalize(Vec)).rgb;
    FragColor = vec4(texColor, 1.0f);
}
