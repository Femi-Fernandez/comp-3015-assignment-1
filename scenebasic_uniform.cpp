#include "scenebasic_uniform.h"

#include <cstdio>
#include <cstdlib>

#include <string>
using std::string;

#include <iostream>
using std::cerr;
using std::endl;

#include "helper/glutils.h"

#include "helper/texture.h"

#include <glm/gtc/matrix_transform.hpp>

using glm::vec3;
using glm::mat4;
using glm::vec4;
using glm::mat3;

float x, z;

int lightingType;

SceneBasic_Uniform::SceneBasic_Uniform() : plane_(10.0f, 10.0f, 100, 100)
{

    mesh = ObjMesh::load("../Comp-3015-assignment-1/media/model.obj", true);
}

void SceneBasic_Uniform::initScene()
{
	compile();

	glEnable(GL_DEPTH_TEST);

	model = mat4(1.0f);

	view = glm::lookAt(vec3(0.5f, 0.75f, 0.75f), vec3(0.0f, 0.0f, 0.0f),vec3(0.0f, 1.0f, 0.0f));
	//view = glm::lookAt(vec3(5.0f, 5.0f, 7.5f), vec3(0.0f, 0.75f, 0.0f), vec3(0.0f, 1.0f, 0.0f));
	projection = mat4(1.0f);


	lightingType = 1;
	prog.setUniform("lightingSelect", lightingType);


	if (lightingType == 1)
	{
		prog.setUniform("light.Position", view * glm::vec4(x, 1.2f, z + 1.0f, 1.0f));
		prog.setUniform("light.L", vec3(0.8f, 0.8f, 0.8f));
		prog.setUniform("light.La", vec3(0.8f, 0.8f, 0.8f));
	}

	if (lightingType == 2)
	{
		projection = mat4(1.0f);
		prog.setUniform("Spot.L", vec3(0.9f));
		prog.setUniform("Spot.La", vec3(0.3f));
		prog.setUniform("Spot.Exponent", 50.0f);
		prog.setUniform("Spot.Cutoff", glm::radians(15.0f));
	}


	GLuint colour = Texture::loadTexture("media/texture/scifi_bike_base.jpg");
	GLuint norm = Texture::loadTexture("media/texture/scifi_bike_norm.png");

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, colour);

	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, norm);


}

void SceneBasic_Uniform::compile()
{
	try {
		prog.compileShader("shader/basic_uniform.vert");
		prog.compileShader("shader/basic_uniform.frag");
		prog.link();
		prog.use();
	} catch (GLSLProgramException &e) {
		cerr << e.what() << endl;
		exit(EXIT_FAILURE);
	}
}

void SceneBasic_Uniform::update( float t )
{
	//update your angle here

}

void SceneBasic_Uniform::render()
{
	glClear(GL_COLOR_BUFFER_BIT);

	glClear(GL_DEPTH_BUFFER_BIT);

	if (lightingType == 2)
	{
		vec4 lightPos = vec4(0.0f, 10.0f, 0.0f, 1.0f);
		prog.setUniform("Spot.Position", vec3(view * lightPos));
		mat3 normalMatrix = mat3(vec3(view[0]), vec3(view[1]), vec3(view[2]));
		prog.setUniform("Spot.Direction", normalMatrix * vec3(-lightPos));
	}

	prog.setUniform("Material.Kd", 0.4f, 0.4f, 0.4f);
	prog.setUniform("Material.Ks", 0.9f, 0.9f, 0.9f);
	prog.setUniform("Material.Ka", 0.5f, 0.5f, 0.5f);
	prog.setUniform("Material.Shininess", 180.0f);

	model = mat4(1.0f);
	model = glm::rotate(model, glm::radians(180.0f), vec3(0.0f, 1.0f, 0.0f));
	//model = glm::scale(model, vec3(2.0f, 2.0f, 2.0f));
	setMatrices();
	mesh->render();


	prog.setUniform("Material.Kd", 0.7f, 0.7f, 0.7f);
	prog.setUniform("Material.Ks", 0.9f, 0.9f, 0.9f);
	prog.setUniform("Material.Ka", 0.2f, 0.2f, 0.2f);
	prog.setUniform("Material.Shininess", 180.0f);
	model = mat4(1.0f);
	model = glm::translate(model, glm::vec3(0.0f, -.75f, 0.0f));
	
	setMatrices();
	plane_.render();

}

void SceneBasic_Uniform::setMatrices()
{
	mat4 mv;

	mv = view * model;

	prog.setUniform("ModelViewMatrix", mv);
	prog.setUniform("NormalMatrix", glm::mat3(vec3(mv[0]), vec3(mv[1]), vec3(mv[2])));

	prog.setUniform("MVP", projection * mv);

}

void SceneBasic_Uniform::resize(int w, int h)
{
	glViewport(0, 0, w, h);
	width = w;
	height = h;
	projection = glm::perspective(glm::radians(70.0f), (float)w / h,
		0.3f, 100.0f);
}
