import { Effect } from "babylonjs";

let name = 'simplePixelShader';
let shader = `precision highp float;

uniform vec3 vEyePosition;
uniform vec4 vDiffuseColor;

varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif

#include<helperFunctions>

#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>

#ifdef DIFFUSE
varying vec2 vDiffuseUV;
uniform sampler2D diffuseSampler;
uniform vec2 vDiffuseInfos;
#endif
#include<clipPlaneFragmentDeclaration>

#include<fogFragmentDeclaration>
void main(void) {
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition-vPositionW);

vec4 baseColor=vec4(1.,1.,1.,1.);
vec3 diffuseColor=vDiffuseColor.rgb;

float alpha=vDiffuseColor.a;
#ifdef DIFFUSE
baseColor=texture2D(diffuseSampler,vDiffuseUV);
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
#include<depthPrePass>
baseColor.rgb*=vDiffuseInfos.y;
#endif
#ifdef VERTEXCOLOR
baseColor.rgb*=vColor.rgb;
#endif

#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif

vec3 diffuseBase=vec3(0.,0.,0.);
lightingInfo info;
float shadow=1.;
float glossiness=0.;
#ifdef SPECULARTERM
vec3 specularBase=vec3(0.,0.,0.);
#endif 
#include<lightFragment>[0..maxSimultaneousLights]
#ifdef VERTEXALPHA
alpha*=vColor.a;
#endif
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;

vec4 color=vec4(finalDiffuse,alpha);
#include<fogFragment>
gl_FragColor=color;
}`;

Effect.ShadersStore[name] = shader;

export { shader, name };