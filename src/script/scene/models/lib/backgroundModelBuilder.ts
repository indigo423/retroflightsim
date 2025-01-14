import * as THREE from 'three';
import { SceneMaterialManager } from "../../materials/materials";
import { PaletteCategory } from '../../palettes/palette';
import { updateUniforms } from '../../utils';
import { Model, ModelLibBuilder } from "../models";

const GROUND_SIZE = 1000000;
const SKY_SIZE = 100000;

export class BackgroundModelLibBuilder implements ModelLibBuilder {

    constructor(public type: BackgroundModelLibBuilder.Type) { }

    build(materials: SceneMaterialManager): Model {
        const geometry = this.buildGeometry();
        const mesh = new THREE.Mesh(geometry, materials.build({
            category: this.type === BackgroundModelLibBuilder.Type.GROUND ? PaletteCategory.TERRAIN_DEFAULT : PaletteCategory.SKY,
            depthWrite: false,
            shaded: false
        }));
        mesh.name = this.type;
        mesh.onBeforeRender = updateUniforms;
        return {
            lod: [{
                flats: [mesh],
                volumes: []
            }],
            maxSize: this.type === BackgroundModelLibBuilder.Type.GROUND ? GROUND_SIZE : SKY_SIZE,
            center: new THREE.Vector3()
        };
    }

    private buildGeometry(): THREE.PlaneGeometry {
        if (this.type === BackgroundModelLibBuilder.Type.GROUND) {
            const geometry = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
            geometry.center();
            geometry.rotateX(-Math.PI / 2);
            return geometry;
        } else {
            const geometry = new THREE.PlaneGeometry(SKY_SIZE, SKY_SIZE, 1, 1);
            geometry.center();
            geometry.rotateX(Math.PI / 2);
            return geometry;
        }
    }
}

export namespace BackgroundModelLibBuilder {
    export enum Type {
        SKY = 'SKY',
        GROUND = 'GROUND'
    }
}
