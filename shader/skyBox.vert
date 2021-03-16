#version 460

layout (location = 0) in vec3 VertexPosition;

out vec3 Vec;

uniform mat4 MVP;


void main()
{

    //pass vertex position to the frag shader
    Vec = VertexPosition;
    gl_Position = MVP * vec4(VertexPosition,1.0);
  
}
