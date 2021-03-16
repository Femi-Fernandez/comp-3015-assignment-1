#ifndef SCENEBASIC_UNIFORM_H
#define SCENEBASIC_UNIFORM_H

#include "helper/scene.h"

#include <glad/glad.h>
#include "helper/glslprogram.h"

#include <glm/glm.hpp>

#include "helper/Objmesh.h"
#include "helper/plane.h"
#include "helper/skybox.h"

class SceneBasic_Uniform : public Scene
{
private:
    GLuint vaoHandle, groundnorm, groundcol, colour, norm;
    GLSLProgram prog, skyObj;
    //float angle;

    std::unique_ptr<ObjMesh> mesh;
    Plane plane_;
    SkyBox sky;
    float angle, tPrev, rotSpeed;

    void compile();

    void setMatrices();
    void setSkyMatrices();

public:
    SceneBasic_Uniform();

    void initScene();
    void update( float t );
    void render();
    void resize(int, int);
};

#endif // SCENEBASIC_UNIFORM_H
