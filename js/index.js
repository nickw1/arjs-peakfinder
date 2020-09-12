require('aframe-osm-3d');

AFRAME.registerComponent('peakfinder', {
    schema: {
        scale: {
            type: 'number',
            default: 20
        }
    },

    init: function() {
        this.textScale = this.data.scale * 100;
        this.camera = document.querySelector('a-camera');

        window.addEventListener('gps-camera-update-position', e => {
            this.el.setAttribute('terrarium-dem', {
                lat: e.detail.position.latitude,
                lon: e.detail.position.longitude 
            })
        });

        this.el.addEventListener('elevation-available', e => {
            const position = this.camera.getAttribute('position');
            position.y = e.detail.elevation + 1.6;
            this.camera.setAttribute('position', position);
        });

        this.el.addEventListener('osm-data-loaded', e => {
            e.detail.pois
                .filter ( f => f.properties.natural == 'peak' )
                .forEach ( peak => {
                    console.log(peak);
                    const entity = document.createElement('a-entity');
                    entity.setAttribute('look-at', '[gps-projected-camera]');
                    const text = document.createElement('a-text');
                    text.setAttribute('value', peak.properties.name);
                    text.setAttribute('scale', {
                        x: this.textScale,
                        y: this.textScale,
                        z: this.textScale
                    });
                    text.setAttribute('align', 'center');
                    text.setAttribute('position', {
                        x: 0,
                        y: this.data.scale * 20, 
                        z: 0
                    });
                    entity.setAttribute('gps-projected-entity-place', {
                        latitude: peak.geometry[2],
                        longitude: peak.geometry[0]
                    });
                    entity.setAttribute('position', {
                        x: 0,
                        y: peak.geometry[1],
                        z: 0
                    });
                    entity.appendChild(text);
                    const cone = document.createElement('a-cone');
                    cone.setAttribute('radiusTop', 0.1);
                    cone.setAttribute('scale', {
                        x: this.data.scale * 10,
                        y: this.data.scale * 10,
                        z: this.data.scale * 10
                    });
                    cone.setAttribute('height', 3);
                    cone.setAttribute('material', { color: 'magenta' } );
                    entity.appendChild(cone);

                    this.el.appendChild(entity);
                    console.log('appending');
                });
        });
    }
});
