#version 460

in vec3 LightDir;
in vec3 ViewDir;
in vec2 TexCoord;

in vec3 Position;
in vec3 Normal;
in vec3 Vec;

uniform mat4 ModelViewMatrix;

uniform struct LightInfo {
 vec4 Position; // Light position
 vec3 La; // Ambient light intensity
 vec3 L; // Diffuse and specular light intensity
} light;

uniform struct SpotLightInfo {
 vec3 Position; // Light position in eye coords.
 vec3 Direction; // direction the light is pointing in
 vec3 La;
 vec3 L;
 float Exponent;
 float Cutoff;
} Spot;

uniform struct MaterialInfo {
vec3 Ka; // Ambient reflectivity
 vec3 Kd; // Diffuse reflectivity
 vec3 Ks; // Specular reflectivity
 float Shininess; // Specular shininess factor
} Material;

uniform int lightingSelect; //what lighting to use 
uniform int texSelect; //what texture to display

layout(binding=0) uniform sampler2D ColorTex; //bike color texture
layout(binding=1) uniform sampler2D NormalTex;//bike normal map

layout(binding=2) uniform sampler2D concreteColorTex; //concrete color texture
layout(binding=3) uniform sampler2D concreteNormalTex; //concrete normal map


layout (location = 0) out vec4 FragColor;


vec3 phongModel( vec3 position, vec3 n, sampler2D Color) {

    //calculate the ambient using the texture color
    vec4 baseTex = texture(Color, TexCoord).rgba;
    vec3 col = baseTex.rgb;

    vec3 ambient =  light.La * Material.Ka * col;

    //calculate diffuse
    vec3 s = normalize(position);     
    float sDotN = max(dot(s,n), 0);    
    
    vec3 diffuse = Material.Kd * sDotN * col;

    //calculate specular
     vec3 spec = vec3(0.0);

     if( sDotN > 0.0 )
        {
        vec3 v = normalize(-position.xyz + ViewDir);

        spec = Material.Ks * pow( max( dot(n,v), 0.0 ),Material.Shininess );

     }   
     //return the final color
     return ambient + light.L * (diffuse + spec);
}

vec3 blinnPhongSpot( vec3 position, vec3 n , sampler2D Color)
{

    //calculate ambient
    vec4 baseTex = texture(Color, TexCoord).rgba;
    vec3 col = baseTex.rgb;

    vec3 ambient =  Spot.La * Material.Ka * col;

    //get values to calculate diffuse & work out where spotlight is shining
    vec3 s = normalize(vec3(Spot.Position) - position); 

    float cosAng = dot(-s, normalize(Spot.Direction));
    float angle = acos( cosAng );
    float spotScale = 0.0;

    vec3 spec = vec3(0.0);
    vec3 diffuse = vec3(0,0,0);
    //if its actually in the spotlight
    if(angle < Spot.Cutoff )
    {
        spotScale = pow( cosAng, Spot.Exponent );

        //calculate diffuse
        float sDotN = dot(s,n);  
        vec3 diffuse = Material.Kd * sDotN * col;
        
        //calculate specular
        if( sDotN > 0.0 )
            {
             vec3 v = normalize(-position.xyz);

             vec3 h = normalize(v +s);
             spec = Material.Ks * pow( max( dot(h,n), 0.0 ),Material.Shininess );
             return ambient + spotScale * Spot.L * (diffuse + spec);
            }
            
    }
    //return the final color
    return ambient + spotScale * Spot.L * (diffuse + spec);
}

void main() {

    //if point light is being used
    if (lightingSelect == 1)
        {
        //if the bike is being rendered input bike color texture
            if(texSelect == 1)
            {
                vec3 norm = texture(NormalTex, TexCoord).xyz;
                norm.xy = 2.0 * norm.xy - 1.0;

                FragColor = vec4(phongModel(LightDir, normalize(norm), ColorTex), 1) ;
            }
             //if the concrete is being rendered input concrete color texture
            if(texSelect == 2)
            {
                vec3 norm = texture(concreteNormalTex, TexCoord).xyz;
                norm.xy = 2.0 * norm.xy - 1.0;

                FragColor = vec4(phongModel(LightDir, normalize(norm), concreteColorTex), 1) ;
            }
            
        }
    
    //if spotlight light is being used
    if (lightingSelect == 2)
    { 
        //if the bike is being rendered input bike color texture
        if(texSelect == 1)
        {
            vec3 norm = texture(NormalTex, TexCoord).xyz;
            norm.xy = 2.0 * norm.xy - 1.0;
    
            FragColor = vec4(blinnPhongSpot(Position, normalize(Normal), ColorTex), 1);
        }
        //if the concrete is being rendered input concrete color texture
        if(texSelect == 2)
        {
            vec3 norm = texture(concreteNormalTex, TexCoord).xyz;
            norm.xy = 2.0 * norm.xy - 1.0;
    
            FragColor = vec4(blinnPhongSpot(Position, normalize(Normal), concreteColorTex), 1);
        }
        
    
    }
}
