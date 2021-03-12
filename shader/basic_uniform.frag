#version 460

//in vec3 Position;
//in vec3 Normal;
//in vec2 TexCoord;

in vec3 LightDir;
in vec3 ViewDir;
in vec2 TexCoord;

uniform mat4 ModelViewMatrix;

uniform struct LightInfo {
 vec4 Position; // Light position in eye coords.
 vec3 La; // Ambient light intensity
 vec3 L; // Diffuse and specular light intensity
} light;

uniform struct MaterialInfo {
vec3 Ka; // Ambient reflectivity
 vec3 Kd; // Diffuse reflectivity
 vec3 Ks; // Specular reflectivity
 float Shininess; // Specular shininess factor
} Material;

layout(binding=0) uniform sampler2D ColorTex;
//layout(binding=1) uniform sampler2D NormalMapTex;

layout (location = 0) out vec4 FragColor;

vec3 phongModel( vec3 position, vec3 n ) {

//calculate ambient here, to access each light La value use this:
    //lights[light].La
    vec4 baseTex = texture(ColorTex, TexCoord).rgba;

    vec3 col = baseTex.rgb;

        vec3 ambient =  light.La * col;


    //calculate diffuse here
   // vec3 s = normalize(vec3(lights.Position)- position);    
    vec3 s = normalize(position);    

    //calculate dot product between s & n
    float sDotN = max(dot(s,n), 0);                                              
    vec3 diffuse = Material.Kd * sDotN * col;

    //calculate specular here

    vec3 spec = Material.Ks * light.L * sDotN;
     //vec3 spec = vec3(0.0);


     if( sDotN > 0.0 )
    {
     vec3 v = normalize(-position.xyz + ViewDir);

     //phong model
     vec3 r = reflect( -s, n );   
     spec = Material.Ks * pow( max( dot(n,v), 0.0 ),Material.Shininess );

    //blinnPhong
    //vec3 h = normalize(v +s);
    //spec = Material.Ks * pow( max( dot(h,n), 0.0 ),Material.Shininess );
     }   

     return ambient + light.L * (diffuse + spec);

}



void main() {
    vec3 norm = texture(ColorTex, TexCoord).xyz;
    norm.xy = 2.0 * norm.xy - 1.0;
   FragColor = vec4(phongModel(LightDir, normalize(norm)), 1);
}
