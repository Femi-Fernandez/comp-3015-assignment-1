#version 460

in vec3 Position;
in vec3 Normal;

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

layout (location = 0) out vec4 FragColor;

vec3 phongModel( vec3 position, vec3 n ) {

//calculate ambient here, to access each light La value use this:
    //lights[light].La
    vec3 ambient =  light.La * Material.Ka;

    //calculate diffuse here
    //find out s vector
    //vec4 p = ModelViewMatrix * vec4(position, 1.0);
    vec3 s = normalize(vec3(light.Position )- position);    
    
    //calculate dot product between s & n
    float sDotN = dot(s,n);                                              
     vec3 diffuse = Material.Kd * sDotN;
    //calculate specular here

    vec3 spec = Material.Ks * light.L * sDotN;
     //vec3 spec = vec3(0.0);


     if( sDotN > 0.0 )
    {
     vec3 v = normalize(-position.xyz);

     //phong model
     vec3 r = reflect( -s, n );   
     spec = Material.Ks * pow( max( dot(r,v), 0.0 ),Material.Shininess );

    //blinnPhong
    //vec3 h = normalize(v +s);
    //spec = Material.Ks * pow( max( dot(h,n), 0.0 ),Material.Shininess );
     }
     return ambient + light.L * (diffuse + spec);

}



void main() {
   FragColor = vec4(phongModel(Position, normalize(Normal)), 1);
}
