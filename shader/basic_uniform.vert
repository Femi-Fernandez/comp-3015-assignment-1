#version 460

layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;
layout (location = 2) in vec2 VertexTexCoord;
layout (location = 3) in vec4 VertexTangent;


out vec3 Position;
out vec3 Normal;


out vec3 LightDir;
out vec3 ViewDir;
out vec2 TexCoord;

uniform mat4 ModelViewMatrix;
uniform mat3 NormalMatrix;
uniform mat4 ProjectionMatrix;
uniform mat4 MVP;

uniform struct LightInfo {
vec4 Position;
vec3 La; 
vec3 L;
} light;

uniform int lightingSelect;


void main()
{
    //Normal = normalize( NormalMatrix * VertexNormal);
    //Position = (ModelViewMatrix * vec4(VertexPosition,1.0)).xyz;
    //gl_Position = MVP * vec4(VertexPosition,1.0);

    if(lightingSelect == 1)
    {

        vec3 norm = normalize( NormalMatrix * VertexNormal );
        vec3 tang = normalize( NormalMatrix * vec3(VertexTangent) );

        // Compute the binormal
        vec3 binormal = normalize( cross( norm, tang ) ) * VertexTangent.w;

        // Matrix for transformation to tangent space
        mat3 toObjectLocal = mat3(
        tang.x, binormal.x, norm.x,
        tang.y, binormal.y, norm.y,
        tang.z, binormal.z, norm.z ) ;
    
        vec3 pos = vec3( ModelViewMatrix * vec4(VertexPosition,1.0) );

        LightDir = toObjectLocal * (light.Position.xyz - pos);
        ViewDir = toObjectLocal * normalize(-pos);

        TexCoord = VertexTexCoord;
        gl_Position = MVP * vec4(VertexPosition,1.0);
    }

    if(lightingSelect == 2)
    {
        Normal = normalize( NormalMatrix * VertexNormal);
        Position = (ModelViewMatrix * vec4(VertexPosition,1.0)).xyz;
        gl_Position = MVP * vec4(VertexPosition,1.0);
    }
}
