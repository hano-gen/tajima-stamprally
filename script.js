// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

async function initializeApp() {
    try {
        // JSONデータの並行読み込み（パスが違う場合はここを修正）
        const [regionsRes, poisRes, coursesRes] = await Promise.all([
            fetch('./regions.json'),
            fetch('./pois.json'),
            fetch('./courses.json')
        ]);

        if (!regionsRes.ok || !poisRes.ok || !coursesRes.ok) {
            throw new Error('データの読み込みに失敗しました: ' + regionsRes.status + ', ' + poisRes.status + ', ' + coursesRes.status);
        }

        // 各レスポンスをJSONとして解析
        const regionsData = await regionsRes.json();
        const poisData = await poisRes.json();
        const coursesData = await coursesRes.json();

        // グローバル変数にデータを格納（既存コードが参照する名前に合わせて大文字小文字を揃える）
        window.regions = regionsData;
        window.POIS = poisData;
        window.COURSES = coursesData;

        // 既存コードの一部が裸の識別子（regions / POIS / COURSES）で参照している可能性があるため、
        // ブラウザグローバルに直接割り当てておく（safe fallback）
        // eslint-disable-next-line no-undef
        regions = regionsData;
        // eslint-disable-next-line no-undef
        POIS = poisData;
        // eslint-disable-next-line no-undef
        COURSES = coursesData;

        console.log('データの読み込みが完了しました。', { regionsData, poisData, coursesData });

        // ここで必要なら startApplication() 等を呼ぶ
        if (typeof startApplication === 'function') startApplication();

        // 初期化完了を呼び出し元に伝える（呼び出し元で then を待てるように）
        return;
    } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
        throw error;
    }
}

// start the data load and keep the promise
const appInitPromise = initializeApp();


// App State
class ToyookaStampApp {
    constructor() {
        this.currentMode = null;
        this.currentCourse = null;
        this.currentTab = 'map';
        this.userLocation = null;
        this.map = null;
        this.watchId = null;
        this.stampCollection = JSON.parse(localStorage.getItem('stampCollection') || '{}');
        this.courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        this.visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
        this.hasLocationPermission = JSON.parse(localStorage.getItem('locationPermissionGranted') || 'false');
        this.permissionRequested = JSON.parse(localStorage.getItem('permissionRequested') || 'false');
        this.openAccordions = new Set();
        this.selectedSpot = null;
        this.carouselIntervals = new Map();
        // --- 地図アイコン定義（現在地・スポット） ---
        this.icons = {
          // 現在地: パルスする青い点（DivIcon）
          user: L.divIcon({
            className: 'user-marker',
            html: '<div class="dot"></div><div class="ring"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8]
          }),

          // スポット: 赤いピン（SVGアイコンをdata URIで埋め込み）
          poi: L.icon({
            iconUrl:
              'data:image/svg+xml;charset=UTF-8,' +
              encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
                  <path fill="#D64545" d="M12.5 0C5.596 0 0 5.596 0 12.5 0 21.875 12.5 41 12.5 41S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z"/>
                  <circle cx="12.5" cy="12.5" r="5.5" fill="white"/>
                </svg>
              `),
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -36]
          })
        };
        // マーカー参照用の索引
        this.markerIndex = Object.create(null);

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkInitialState();
    }



    checkInitialState() {
        // Check location permission first
        if (!this.permissionRequested) {
            this.showLocationPermission();
            return;
        }

        // Check URL hash for state
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        if (params.get('tab')) {
            this.currentTab = params.get('tab');
            this.currentMode = params.get('mode') || 'free';
            this.currentCourse = params.get('slug') || null;

            this.showMainApp();
            this.switchTab(this.currentTab);
        } else {
            // Show mode select first time
            this.showModeSelect();
        }

        // Start location tracking if permission granted
        if (this.hasLocationPermission) {
            this.startLocationWatch();
        }
    }

    showLocationPermission() {
        document.getElementById('location-permission').classList.remove('hidden');
        document.getElementById('mode-select').classList.add('hidden');
        document.getElementById('start-gate').classList.add('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    async handleLocationPermission() {
        const button = document.querySelector('.primary-button');
        button.innerHTML = `
            <div class="spinner"></div>
            位置情報を取得中...
        `;
        button.classList.add('loading');

        const granted = await this.requestLocationPermission();
        if (granted) {
            this.permissionRequested = true;
            this.hasLocationPermission = true;
            localStorage.setItem('permissionRequested', 'true');
            localStorage.setItem('locationPermissionGranted', 'true');
            this.startLocationWatch();
            this.checkInitialState();
        } else {
            alert('位置情報の許可が必要です。ブラウザの設定から許可してください。');
            button.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                位置情報の使用を許可
            `;
            button.classList.remove('loading');
        }
    }

    handleLocationDenied() {
        this.permissionRequested = true;
        this.hasLocationPermission = false;
        localStorage.setItem('permissionRequested', 'true');
        localStorage.setItem('locationPermissionGranted', 'false');
        this.checkInitialState();
    }

    async requestLocationPermission() {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(true);
                },
                () => {
                    resolve(false);
                }
            );
        });
    }

    startLocationWatch() {
        if (navigator.geolocation && this.hasLocationPermission) {
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.updateLocationUI();
                },
                (error) => {
                    console.warn('Location error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 30000
                }
            );
        }
    }

    updateLocation() {
        if (this.hasLocationPermission) {
            const btn = document.getElementById('location-update-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<div class="spinner"></div>';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.updateLocationUI();
                    btn.innerHTML = originalHTML;
                },
                () => {
                    btn.innerHTML = originalHTML;
                }
            );
        } else {
            alert('位置情報の許可が必要です');
        }
    }

    updateLocationUI() {
        const locationStatus = document.getElementById('location-status');
        if (this.userLocation) {
            locationStatus.className = 'location-status success';
            locationStatus.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
                </svg>
                位置情報取得済み
                <button class="location-update-btn" onclick="app.updateLocation()" id="location-update-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    更新
                </button>
            `;
        }

        // Update stamp distances and availability
        this.updateStampAvailability();

        // Update map if it exists
        if (this.map && this.userLocation) {
            // Remove existing user marker
            this.map.eachLayer(layer => {
                if (layer.options && layer.options.isUserMarker) {
                    this.map.removeLayer(layer);
                }
            });

            // Add new user marker
            L.marker([this.userLocation.lat, this.userLocation.lng], {
                icon: this.icons.user,
                isUserMarker: true
            })
                .addTo(this.map)
                .bindPopup('現在地', { autoPan: false });
        }
    }

    updateStampAvailability() {
        if (!this.userLocation) return;

        // Update all stamp stands with distance information
        document.querySelectorAll('.stamp-stand').forEach(stampElement => {
            const stampId = stampElement.dataset.stampId;
            if (stampId) {
                const poi = window.POIS.find(p => p.id === stampId);
                if (poi) {
                    const distance = this.calculateDistance(
                        this.userLocation.lat, this.userLocation.lng,
                        poi.lat, poi.lng
                    );

                    const distanceBadge = stampElement.querySelector('.distance-badge');
                    if (distanceBadge) {
                        distanceBadge.textContent = `${Math.round(distance)}m`;
                        const isCollected = this.isStampCollected(stampId);
                        const canCollect = distance <= poi.radius_m && !isCollected;
                        distanceBadge.className = `distance-badge ${canCollect ? 'near' : 'far'}`;
                    }

                    // Update stamp availability
                    const isCollected = this.isStampCollected(stampId);
                    const canCollect = distance <= poi.radius_m && !isCollected;

                    if (canCollect) {
                        stampElement.classList.remove('stamp-unavailable');
                        stampElement.onclick = () => this.collectStamp(stampId);
                    } else if (!isCollected) {
                        stampElement.classList.add('stamp-unavailable');
                        stampElement.onclick = null;
                    }
                }
            }
        });
    }

    // Haversine distance calculation
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '5') {
                const tabs = ['map', 'nearby', 'courses', 'profile', 'settings'];
                const tabIndex = parseInt(e.key) - 1;
                if (tabs[tabIndex]) {
                    this.switchTab(tabs[tabIndex]);
                }
            }
        });

        // Hash change listener
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }


    showModeSelect() {
        document.getElementById('location-permission').classList.add('hidden');
        document.getElementById('mode-select').classList.remove('hidden');
        document.getElementById('start-gate').classList.add('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('location-permission').classList.add('hidden');
        document.getElementById('mode-select').classList.add('hidden');
        document.getElementById('start-gate').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');

        this.renderCourses();
        this.updateContinueSection();
        this.updateProfileData();
        this.updateSettingsData();
    }

    selectMode(mode) {
        this.currentMode = mode;

            this.showMainApp();
            this.updateModeGuidance();
            this.updateHash();
    }

    updateModeGuidance() {
        const guidance = document.getElementById('mode-guidance');
        if (this.currentMode === 'course') {
            guidance.textContent = 'コースを選んで豊岡の魅力を発見しよう';
        } else {
            guidance.textContent = 'マップタブで自由に観光地を巡ろう';
        }
    }

    switchTab(tab) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        const screenMap = {
            'map': 'map-view',
            'nearby': 'nearby-view',
            'courses': 'courses-view',
            'profile': 'profile-view',
            'settings': 'settings-view'
        };

        const screenId = screenMap[tab] || 'landing';
        document.getElementById(screenId).classList.add('active');

        // Update tab bar
        document.querySelectorAll('.tab').forEach(tabBtn => {
            tabBtn.setAttribute('data-active', 'false');
        });
        document.querySelector(`[data-tab="${tab}"]`).setAttribute('data-active', 'true');

        this.currentTab = tab;
        this.updateHash();

        // Render content based on tab
        if (tab === 'map') {
            this.renderMapContent();
            this.initializeMap();
        } else if (tab === 'nearby') {
            this.renderNearbyContent();
        } else if (tab === 'profile') {
            this.updateProfileData();
        } else if (tab === 'settings') {
            this.updateSettingsData();
        }
    }

    initializeMap() {
        if (!this.map) {
          // Initialize Leaflet map
          this.map = L.map('map-container').setView([35.5456, 134.8203], 10);

          // Tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);

          // POI markers + 索引登録
          window.POIS.forEach(poi => {
            const marker = L.marker([poi.lat, poi.lng], { icon: this.icons.poi })
              .addTo(this.map)
              .bindPopup(`
                <div style="text-align: center;">
                  <h4>${poi.name}</h4>
                  <p>${poi.description}</p>
                  <button onclick="app.showSpotDetails('${poi.id}')"
                          style="background: var(--brand-primary); color: white; border: none; padding: .5rem 1rem; border-radius: .25rem; cursor: pointer;">
                    詳細を見る
                  </button>
                </div>
              `);

            marker._poiId = poi.id;
            this.markerIndex[poi.id] = marker;
          });

          // 現在地マーカー
          if (this.userLocation) {
            L.marker([this.userLocation.lat, this.userLocation.lng], {
              icon: this.icons.user,
              isUserMarker: true
            })
              .addTo(this.map)
              .bindPopup('現在地')
              .openPopup();

            this.map.setView([this.userLocation.lat, this.userLocation.lng], 12);
          }
        } else {
          // 非表示→表示のサイズ崩れ対策
          this.map.invalidateSize();
        }
    }

    focusPoiOnMap(poiId, opts = {}) {
      const marker = this.markerIndex?.[poiId];
      if (!marker || !this.map) return;

      const latlng = marker.getLatLng();
      const zoom = Math.max(this.map.getZoom() || 0, opts.zoom || 16);

      // ポップアップの autoPan を一時的に止めて、中央からズレるのを防ぐ
      const popup = marker.getPopup && marker.getPopup();
      let prevAutoPan;
      if (popup) { prevAutoPan = popup.options.autoPan; popup.options.autoPan = false; }
      marker.openPopup();

      // きっちり中央へ
      this.map.setView(latlng, zoom, { animate: true });

      // 元に戻す
      if (popup) popup.options.autoPan = prevAutoPan;

      // ここから下の拡大系処理は不要なので入れません
      // （.poi-pop 付与、ZIndexOffset の一時変更 等）
    }



    renderMapContent() {
        const mapContent = document.getElementById('map-content');
        const mapDescription = document.getElementById('map-description');

        if (this.currentMode === 'course' && this.currentCourse) {
            // Course mode: show spots in order
            mapDescription.textContent = 'コースの順番に観光地を巡りましょう';
            const course = window.COURSES.find(c => c.slug === this.currentCourse);
            if (course) {
                const coursePOIs = course.poi_ids.map(id => window.POIS.find(p => p.id === id)).filter(Boolean);
                mapContent.innerHTML = this.renderCourseSpots(coursePOIs);
            }
        } else {
            // Free mode: show by regions
            mapDescription.textContent = '地域別に観光地を確認できます';
            mapContent.innerHTML = this.renderRegionAccordions();
        }
    }

    renderCourseSpots(spots) {
        return spots.map((spot, index) => {
            const isCollected = this.isStampCollected(spot.id);
            return `
                <div class="tourist-spot" onclick="app.showSpotDetails('${spot.id}')">
                    <div class="spot-left">
                    <button class="spot-icon" type="button"
                            onclick="event.stopPropagation(); app.focusPoiOnMap('${spot.id}')"
                            title="地図でこのスポットへ移動">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </button>

                        <div class="spot-info">
                            <h4>${index + 1}. ${spot.name}</h4>
                            <p>${spot.description}</p>
                        </div>
                    </div>
                    <div class="spot-right">
                        <div class="badge points ${isCollected ? '' : 'outline'}">
                            ${spot.points}pt
                        </div>
                        ${isCollected ? `
                            <div class="badge visits">
                                取得済み
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderRegionAccordions() {
        return Object.entries(regions).map(([regionId, region]) => {
            const regionSpots = window.POIS.filter(spot => spot.region === regionId);
            const achievement = this.getRegionAchievement(regionId);
            const isOpen = this.openAccordions.has(regionId);

            return `
                <div class="accordion">
                    <div class="accordion-header ${isOpen ? 'active' : ''}" onclick="app.toggleAccordion('${regionId}')">
                        <div class="accordion-title">
                            <span style="font-size: 1.5rem; margin-right: 0.5rem;">${region.icon}</span>
                            ${region.name}
                        </div>
                        <div class="accordion-stats">
                            <div class="accordion-achievement">
                                ${achievement.collected}/${achievement.total} (${achievement.percentage}%)
                            </div>
                            <div class="accordion-arrow">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-content ${isOpen ? 'active' : ''}">
                        <div class="accordion-body">
                            ${regionSpots.length > 0 ? regionSpots.map(spot => `
                                <div class="tourist-spot" onclick="app.showSpotDetails('${spot.id}')">
                                    <div class="spot-left">
                                    <button class="spot-icon" type="button"
                                            onclick="event.stopPropagation(); app.focusPoiOnMap('${spot.id}')"
                                            title="地図でこのスポットへ移動">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </button>
                                        <div class="spot-info">
                                            <h4>${spot.name}</h4>
                                            <p>${spot.description}</p>
                                        </div>
                                    </div>
                                    <div class="spot-right">
                                        <div class="badge points ${this.isStampCollected(spot.id) ? '' : 'outline'}">
                                            ${spot.points}pt
                                        </div>
                                        ${this.isStampCollected(spot.id) ? `
                                            <div class="badge visits">
                                                取得済み
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="empty-state">
                                    <div class="empty-state-icon">📍</div>
                                    <p>この地域にはまだ観光スポットが登録されていません</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderNearbyContent() {
        const stampContent = document.getElementById('stamp-content');

        // Update stats
        const collectedCount = Object.keys(this.stampCollection).length;
        const totalPoints = this.getTotalPoints();
        const achievementRate = this.getAchievementPercentage();

        document.getElementById('collected-count').textContent = collectedCount;
        document.getElementById('total-points').textContent = totalPoints;
        document.getElementById('achievement-rate').textContent = `${achievementRate}%`;

        if (this.currentMode === 'course' && this.currentCourse) {
            // Course mode: show stamps in course order
            const course = window.COURSES.find(c => c.slug === this.currentCourse);
            if (course) {
                const coursePOIs = course.poi_ids.map(id => window.POIS.find(p => p.id === id)).filter(Boolean);
                stampContent.innerHTML = this.renderCourseStamps(coursePOIs);
            }
        } else {
            // Free mode: show by regions
            stampContent.innerHTML = this.renderRegionStamps();
        }

        // Update stamp availability after rendering
        setTimeout(() => this.updateStampAvailability(), 100);
    }

    renderCourseStamps(spots) {
        return `
            <div class="accordion">
                <div class="accordion-header active">
                    <div class="accordion-title">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem;">🗺️</span>
                        コーススタンプ
                    </div>
                    <div class="accordion-stats">
                        <div class="accordion-achievement">
                            ${spots.filter(s => this.isStampCollected(s.id)).length}/${spots.length}
                        </div>
                    </div>
                </div>
                <div class="accordion-content active">
                    <div class="accordion-body">
                        <div class="stamp-grid">
                            ${spots.map((stamp, index) => {
                                const isCollected = this.isStampCollected(stamp.id);
                                const distance = this.userLocation ? this.calculateDistance(
                                    this.userLocation.lat, this.userLocation.lng,
                                    stamp.lat, stamp.lng
                                ) : null;

                                return `
                                    <div class="stamp-stand ${!isCollected && (distance === null || distance > stamp.radius_m) ? 'stamp-unavailable' : ''}"
                                         data-stamp-id="${stamp.id}"
                                         onclick="app.collectStamp('${stamp.id}')">
                                        <div class="stamp-stand-circle ${isCollected ? 'stamp-stand-collected' : ''}">
                                            <div class="stamp-stand-img" ${isCollected && stamp.stampimageURL ? `style="background-image: url('${stamp.stampimageURL}')"` : ''}>
                                                ${isCollected && stamp.stampimageURL ? '' : index + 1}
                                            </div>
                                        </div>
                                        <span class="stamp-stand-label">${stamp.name}</span>
                                        ${distance !== null ? `
                                            <div class="distance-badge ${distance <= 1000 ? 'near' : 'far'}">
                                                ${Math.round(distance)}m
                                            </div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRegionStamps() {
        return Object.entries(regions).map(([regionId, region]) => {
            const regionSpots = window.POIS.filter(spot => spot.region === regionId);
            const achievement = this.getRegionAchievement(regionId);
            const isOpen = this.openAccordions.has(regionId);

            return `
                <div class="accordion">
                    <div class="accordion-header ${isOpen ? 'active' : ''}" onclick="app.toggleAccordion('${regionId}')">
                        <div class="accordion-title">
                            <span style="font-size: 1.5rem; margin-right: 0.5rem;">${region.icon}</span>
                            ${region.name}
                        </div>
                        <div class="accordion-stats">
                            <div class="accordion-achievement">
                                ${achievement.collected}/${achievement.total} (${achievement.percentage}%)
                            </div>
                            <div class="accordion-arrow">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-content ${isOpen ? 'active' : ''}">
                        <div class="accordion-body">
                            ${regionSpots.length > 0 ? `
                                <div class="stamp-grid">
                                    ${regionSpots.map(stamp => {
                                        const isCollected = this.isStampCollected(stamp.id);
                                        const distance = this.userLocation ? this.calculateDistance(
                                            this.userLocation.lat, this.userLocation.lng,
                                            stamp.lat, stamp.lng
                                        ) : null;

                                        return `
                                            <div class="stamp-stand ${!isCollected && (distance === null || distance > stamp.radius_m) ? 'stamp-unavailable' : ''}"
                                                 data-stamp-id="${stamp.id}"
                                                 onclick="app.collectStamp('${stamp.id}')">
                                                <div class="stamp-stand-circle ${isCollected ? 'stamp-stand-collected' : ''}">
                                                    <div class="stamp-stand-img" ${isCollected && stamp.stampimageURL ? `style="background-image: url('${stamp.stampimageURL}')"` : ''}>
                                                        ${isCollected && stamp.stampimageURL ? '' : this.getCategoryIcon(stamp.category)}
                                                    </div>
                                                </div>
                                                <span class="stamp-stand-label">${stamp.name}</span>
                                                ${distance !== null ? `
                                                    <div class="distance-badge ${distance <= 1000 ? 'near' : 'far'}">
                                                        ${Math.round(distance)}m
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : `
                                <div class="empty-state">
                                    <div class="empty-state-icon">📍</div>
                                    <p>この地域にはまだ観光スポットが登録されていません</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getCategoryIcon(category) {
        const icons = {
            'culture': '🏛️',
            'spring': '♨️',
            'sea': '🌊',
            'art': '🎨',
            'temple': '⛩️'
        };
        return icons[category] || '📍';
    }

    collectStamp(stampId) {
        if (!this.userLocation) {
            alert('位置情報が取得できていません');
            return false;
        }

        const stamp = window.POIS.find(s => s.id === stampId);
        if (!stamp) return false;

        // Distance check
        const distance = this.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            stamp.lat, stamp.lng
        );

        if (distance > stamp.radius_m) {
            alert(`${stamp.name}から${Math.round(distance)}m離れています。${stamp.radius_m}m以内に近づいてください。`);
            return false;
        }

        // Check if already collected today
        const today = new Date().toDateString();
        if (this.stampCollection[stampId] === today) {
            alert('今日は既にこのスタンプを取得済みです');
            return false;
        }

        // Collect stamp
        this.stampCollection[stampId] = today;

        // Add to visit history
        const visit = {
            spotId: stampId,
            spotName: stamp.name,
            category: stamp.category,
            points: stamp.points,
            timestamp: new Date().toISOString()
        };

        this.visitHistory.push(visit);
        this.saveData();

        // Show success message
        setTimeout(() => {
            alert(`🎉 ${stamp.name}のスタンプを取得しました！\n+${stamp.points}ポイント`);
        }, 100);

        // Update UI immediately
        this.renderNearbyContent();
        this.updateProfileData();
        this.updateSettingsData();

        // Check course completion
        if (this.currentMode === 'course' && this.currentCourse) {
            this.checkCourseCompletion();
        }

        return true;
    }

    checkCourseCompletion() {
        const course = window.COURSES.find(c => c.slug === this.currentCourse);
        if (!course) return;

        const allCollected = course.poi_ids.every(id => this.isStampCollected(id));
        if (allCollected) {
            delete this.courseProgress[this.currentCourse];
            this.saveData();

            setTimeout(() => {
                alert(`🎊 おめでとうございます！\n「${course.title}」を完走しました！`);
            }, 500);
        }
    }

    isStampCollected(stampId) {
        return !!this.stampCollection[stampId];
    }

    getTotalPoints() {
        return this.visitHistory.reduce((total, visit) => total + visit.points, 0);
    }

    getAchievementPercentage() {
        const totalSpots = window.POIS.length;
        const collectedSpots = Object.keys(this.stampCollection).length;
        return totalSpots > 0 ? Math.round((collectedSpots / totalSpots) * 100) : 0;
    }

    getRegionAchievement(regionId) {
        const regionSpots = window.POIS.filter(spot => spot.region === regionId);
        const collectedSpots = regionSpots.filter(spot => this.isStampCollected(spot.id));
        return {
            collected: collectedSpots.length,
            total: regionSpots.length,
            percentage: regionSpots.length > 0 ? Math.round((collectedSpots.length / regionSpots.length) * 100) : 0
        };
    }

    toggleAccordion(regionId) {
        if (this.openAccordions.has(regionId)) {
            this.openAccordions.delete(regionId);
        } else {
            this.openAccordions.add(regionId);
        }

        if (this.currentTab === 'map') {
            this.renderMapContent();
        } else if (this.currentTab === 'nearby') {
            this.renderNearbyContent();
        }
    }

    showSpotDetails(spotId) {
        const spot = window.POIS.find(s => s.id === spotId);
        if (!spot) return;

        this.selectedSpot = spotId;

        // Populate modal content
        document.getElementById('spot-modal-title').textContent = spot.name;
        document.getElementById('spot-modal-description').textContent = spot.description;
        document.getElementById('spot-modal-image').src = spot.imageURL;
        document.getElementById('spot-modal-detailed').textContent = spot.detailedDescription;
        document.getElementById('spot-modal-address').textContent = spot.address;
        document.getElementById('spot-modal-address').href = spot.mapLink || '#';
        document.getElementById('spot-modal-access').textContent = spot.accessInfo;
        document.getElementById('spot-modal-hours').textContent = spot.openingHours;
        document.getElementById('spot-modal-points').textContent = `${spot.points}ポイント`;

        // Update highlights
        const highlightsContainer = document.getElementById('spot-modal-highlights');
        highlightsContainer.innerHTML = spot.highlights.map(highlight => `
            <div class="highlight-tag">${highlight}</div>
        `).join('');

        // Show modal
        document.getElementById('spot-detail-modal').classList.remove('hidden');
    }

    closeSpotDetail() {
        document.getElementById('spot-detail-modal').classList.add('hidden');
        this.selectedSpot = null;
    }

    updateProfileData() {
        const totalSpots = window.POIS.length;
        const collectedSpots = Object.keys(this.stampCollection).length;
        const totalPoints = this.getTotalPoints();
        const achievementRate = this.getAchievementPercentage();
        const visitCount = this.visitHistory.length;

        // Update profile card
        document.getElementById('profile-achievement').textContent = achievementRate;
        document.getElementById('profile-points').textContent = totalPoints;
        document.getElementById('profile-rank').textContent = this.getCurrentRank().name;
        document.getElementById('profile-progress-fill').style.width = `${achievementRate}%`;
        document.getElementById('profile-spots').textContent = collectedSpots;
        document.getElementById('profile-total-spots').textContent = totalSpots;

        // Update profile details
        document.getElementById('profile-visited').textContent = collectedSpots;
        document.getElementById('profile-total').textContent = totalSpots;
        document.getElementById('profile-visit-count').textContent = `${visitCount}回`;
        document.getElementById('profile-achievement-rate').textContent = `${achievementRate}%`;

        // Update badges
        this.updateBadges();

        // Update visit history
        this.updateVisitHistory();
    }

    getCurrentRank() {
        const points = this.getTotalPoints();
        if (points >= 15) return { name: 'Platinum', icon: '💎' };
        if (points >= 10) return { name: 'Gold', icon: '🥇' };
        if (points >= 6) return { name: 'Silver', icon: '🥈' };
        if (points >= 3) return { name: 'Bronze', icon: '🥉' };
        return { name: 'Beginner', icon: '🔰' };
    }

    updateBadges() {
        const badges = this.getBadgeConditions();
        const badgesGrid = document.getElementById('badges-grid');

        badgesGrid.innerHTML = badges.map(badge => `
            <div class="badge-item ${badge.color} ${badge.achieved ? '' : 'grayscale'}"
                 onclick="app.showBadgeInfo('${badge.id}')">
                <div class="badge-emoji">${badge.emoji}</div>
                <div class="badge-label ${badge.color}">${badge.name}</div>
                <div class="badge-condition">${badge.condition}</div>
                ${badge.achieved ? '<div style="color: #059669; font-size: 0.75rem; margin-top: 0.25rem;">✓ 獲得済み</div>' : ''}
            </div>
        `).join('');
    }

    getBadgeConditions() {
        const totalPoints = this.getTotalPoints();
        const collectedSpots = Object.keys(this.stampCollection).length;
        const visitCount = this.visitHistory.length;
        const achievementRate = this.getAchievementPercentage();

        return [
            {
                id: 'first-visit',
                name: '初回訪問',
                emoji: '🎯',
                condition: '最初の観光地を訪問',
                achieved: visitCount > 0,
                color: 'green'
            },
            {
                id: 'bronze',
                name: 'Bronze',
                emoji: '🥉',
                condition: '3ポイント以上獲得',
                achieved: totalPoints >= 3,
                color: 'orange'
            },
            {
                id: 'silver',
                name: 'Silver',
                emoji: '🥈',
                condition: '6ポイント以上獲得',
                achieved: totalPoints >= 6,
                color: 'blue'
            },
            {
                id: 'gold',
                name: 'Gold',
                emoji: '🥇',
                condition: '10ポイント以上獲得',
                achieved: totalPoints >= 10,
                color: 'yellow'
            },
            {
                id: 'platinum',
                name: 'Platinum',
                emoji: '💎',
                condition: '15ポイント以上獲得',
                achieved: totalPoints >= 15,
                color: 'purple'
            },
            {
                id: 'three-spots',
                name: '3スポット',
                emoji: '⭐',
                condition: '3つの観光地を訪問',
                achieved: collectedSpots >= 3,
                color: 'blue'
            },
            {
                id: 'half-complete',
                name: '50%達成',
                emoji: '👑',
                condition: '全体の50%を達成',
                achieved: achievementRate >= 50,
                color: 'purple'
            },
            {
                id: 'complete',
                name: '全制覇',
                emoji: '🏆',
                condition: 'すべての観光地を訪問',
                achieved: collectedSpots === window.POIS.length,
                color: 'yellow'
            },
            {
                id: 'explorer',
                name: '探検家',
                emoji: '🗺️',
                condition: '10回以上訪問',
                achieved: visitCount >= 10,
                color: 'red'
            }
        ];
    }

    showBadgeInfo(badgeId) {
        const badges = this.getBadgeConditions();
        const badge = badges.find(b => b.id === badgeId);
        if (badge) {
            alert(`${badge.emoji} ${badge.name}\n\n獲得条件: ${badge.condition}\n\n${badge.achieved ? '✅ 獲得済み' : '❌ 未獲得'}`);
        }
    }

    updateVisitHistory() {
        const visitHistoryContainer = document.getElementById('visit-history');
        const sortedHistory = [...this.visitHistory].reverse();

        if (sortedHistory.length === 0) {
            visitHistoryContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📍</div>
                    <p style="font-size: 1.125rem; font-weight: 500; color: #64748b; margin-bottom: 0.5rem;">まだ訪問履歴がありません</p>
                    <p style="font-size: 0.875rem; color: #64748b;">観光地を訪問してスタンプを集めましょう！</p>
                </div>
            `;
        } else {
            visitHistoryContainer.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
                    <div style="text-align: center; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #5eead4; background: linear-gradient(135deg, #f0fdfa, #ccfbf1);">
                        <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: #0d9488;">${this.visitHistory.length}</div>
                        <div style="font-size: 0.75rem; color: #134e4a;">総訪問回数</div>
                    </div>
                    <div style="text-align: center; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #93c5fd; background: linear-gradient(135deg, #eff6ff, #dbeafe);">
                        <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: #2563eb;">${Object.keys(this.stampCollection).length}</div>
                        <div style="font-size: 0.75rem; color: #1e3a8a;">訪問スポット</div>
                    </div>
                    <div style="text-align: center; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #c4b5fd; background: linear-gradient(135deg, #faf5ff, #f3e8ff);">
                        <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: #7c3aed;">${this.getTotalPoints()}</div>
                        <div style="font-size: 0.75rem; color: #581c87;">総ポイント</div>
                    </div>
                </div>
                <div style="max-height: 24rem; overflow-y: auto;">
                    ${sortedHistory.slice(0, 5).map(visit => `
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: linear-gradient(135deg, white, #f9fafb); border-radius: 0.75rem; border: 1px solid #f1f5f9; margin-bottom: 0.75rem; transition: all 0.2s;">
                            <div style="width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #14b8a6, #10b981); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.25rem; height: 1.25rem; color: white;">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${visit.spotName}</h4>
                                <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; color: #64748b;">
                                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1rem; height: 1rem;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        ${new Date(visit.timestamp).toLocaleDateString('ja-JP')}
                                    </div>
                                </div>
                            </div>
                            <div style="flex-shrink: 0;">
                                <div style="background: #fef3c7; color: #92400e; border: 1px solid #fde047; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;">+${visit.points}pt</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    updateSettingsData() {
        const achievementRate = this.getAchievementPercentage();
        const collectedSpots = Object.keys(this.stampCollection).length;
        const visitCount = this.visitHistory.length;

        document.getElementById('settings-achievement').textContent = `${achievementRate}%`;
        document.getElementById('settings-spots').textContent = `${collectedSpots}スポット`;
        document.getElementById('settings-visits').textContent = `${visitCount}回`;
    }

    renderCourses() {
        const courseGrid = document.getElementById('course-grid');
        const coursesGrid = document.getElementById('courses-grid');

        const courseHTML = window.COURSES.map(course => this.renderCourseCard(course)).join('');

        if (courseGrid) courseGrid.innerHTML = courseHTML;
        if (coursesGrid) coursesGrid.innerHTML = courseHTML;

        // Initialize carousels
        this.initializeCarousels();
    }

    renderCourseCard(course) {
        const stars = '★'.repeat(course.difficulty) + '☆'.repeat(5 - course.difficulty);

        return `
            <div class="course-card" onclick="app.showCourseDetail('${course.slug}')">
                <div class="course-carousel" id="carousel-${course.slug}">
                    <div class="carousel-container">
                        ${course.thumbnails.map((thumbnail, index) => `
                            <div class="carousel-slide" style="background-image: url('${thumbnail}')">
                                ${index === 0 ? '' : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div class="carousel-indicators">
                        ${course.thumbnails.map((_, index) => `
                            <div class="carousel-indicator ${index === 0 ? 'active' : ''}"
                                 onclick="event.stopPropagation(); app.setCarouselSlide('${course.slug}', ${index})"></div>
                        `).join('')}
                    </div>
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <div class="course-badges">
                        <span class="course-badge distance">${course.distance_km}km</span>
                        <span class="course-badge time">${course.duration_min}分</span>
                        <span class="course-badge stamps">${course.stamps_count}スタンプ</span>
                        <span class="course-badge difficulty">
                            <span class="difficulty-stars">${stars}</span>
                        </span>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-outline" onclick="event.stopPropagation(); app.showCourseDetail('${course.slug}')">
                            詳細を見る
                        </button>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); app.startCourseDirectly('${course.slug}')">
                            このコースで始める
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeCarousels() {
        // Clear existing intervals
        this.carouselIntervals.forEach(interval => clearInterval(interval));
        this.carouselIntervals.clear();

        // Initialize new carousels
        window.COURSES.forEach(course => {
            if (course.thumbnails.length > 1) {
                let currentSlide = 0;
                const interval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % course.thumbnails.length;
                    this.setCarouselSlide(course.slug, currentSlide);
                }, 3000);
                this.carouselIntervals.set(course.slug, interval);
            }
        });
    }

    setCarouselSlide(courseSlug, slideIndex) {
        const carousel = document.getElementById(`carousel-${courseSlug}`);
        if (!carousel) return;

        const container = carousel.querySelector('.carousel-container');
        const indicators = carousel.querySelectorAll('.carousel-indicator');

        if (container && indicators.length > 0) {
            container.style.transform = `translateX(-${slideIndex * 20}%)`;

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });
        }
    }

    showCourseDetail(courseSlug) {
        const course = window.COURSES.find(c => c.slug === courseSlug);
        if (!course) return;

        document.getElementById('modal-course-title').textContent = course.title;
        document.getElementById('modal-course-description').textContent = course.description;

        // Update badges
        const stars = '★'.repeat(course.difficulty) + '☆'.repeat(5 - course.difficulty);
        document.getElementById('modal-course-badges').innerHTML = `
            <span class="course-badge distance">${course.distance_km}km</span>
            <span class="course-badge time">${course.duration_min}分</span>
            <span class="course-badge stamps">${course.stamps_count}スタンプ</span>
            <span class="course-badge difficulty">
                <span class="difficulty-stars">${stars}</span>
            </span>
        `;

        // Update timeline
        const timeline = document.getElementById('modal-poi-timeline');
        const pois = course.poi_ids.map(id => window.POIS.find(p => p.id === id)).filter(Boolean);
        timeline.innerHTML = pois.map((poi, index) => `
            <div class="timeline-item">
                <div class="timeline-number">${index + 1}</div>
                <div class="timeline-content">
                    <h4>${poi.name}</h4>
                    <p>${poi.description}</p>
                </div>
            </div>
        `).join('');

        // Set up start button
        document.getElementById('modal-start-btn').onclick = () => {
            this.startCourse(courseSlug);
        };

        document.getElementById('course-detail-modal').classList.remove('hidden');
    }

    closeCourseDetail() {
        document.getElementById('course-detail-modal').classList.add('hidden');
    }

    startCourse(courseSlug = null) {
        if (!courseSlug) {
            const course = window.COURSES.find(c =>
                c.title === document.getElementById('modal-course-title').textContent
            );
            courseSlug = course?.slug;
        }

        if (!courseSlug) return;

        // Check if switching from another course
        if (this.currentCourse && this.currentCourse !== courseSlug) {
            if (!confirm('現在のコースの進捗が初期化されます。よろしいですか？')) {
                return;
            }
        }

        this.currentCourse = courseSlug;
        this.currentMode = 'course';
        this.courseProgress[courseSlug] = { started: new Date().toISOString() };
        this.saveData();

        this.closeCourseDetail();
        this.switchTab('nearby');
        this.updateHash();
        this.updateContinueSection();
    }

    startCourseDirectly(courseSlug) {
        this.startCourse(courseSlug);
    }

    continueCourse() {
        if (this.currentCourse) {
            this.switchTab('nearby');
        }
    }

    updateContinueSection() {
        const continueSection = document.getElementById('continue-section');
        const coursesContinueSection = document.getElementById('courses-continue-section');

        if (this.currentMode === 'course' && this.currentCourse) {
            const course = window.COURSES.find(c => c.slug === this.currentCourse);
            if (course) {
                const courseName = course.title;
                document.getElementById('continue-course-name').textContent = courseName;
                document.getElementById('courses-continue-name').textContent = courseName;

                continueSection.classList.remove('hidden');
                coursesContinueSection.classList.remove('hidden');
                return;
            }
        }

        continueSection.classList.add('hidden');
        coursesContinueSection.classList.add('hidden');
    }

    updateHash() {
        const params = new URLSearchParams();
        params.set('tab', this.currentTab);
        if (this.currentMode) params.set('mode', this.currentMode);
        if (this.currentCourse) params.set('slug', this.currentCourse);

        window.location.hash = params.toString();
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const tab = params.get('tab');
        const mode = params.get('mode');
        const slug = params.get('slug');

        if (mode) this.currentMode = mode;
        if (slug) this.currentCourse = slug;

        if (tab && tab !== this.currentTab) {
            this.switchTab(tab, { suppressHash: true });
        } else {
            // 同一タブの場合でも必要な再描画を行う
            if (this.currentTab === 'map') {
                this.renderMapContent();
                this.initializeMap();
            } else if (this.currentTab === 'nearby') {
                this.renderNearbyContent();
            } else if (this.currentTab === 'profile') {
                this.updateProfileData();
            } else if (this.currentTab === 'settings') {
                this.updateSettingsData();
            }
        }

        this.updateContinueSection();
        this.updateModeGuidance();
    }

    // 永続化
    saveData() {
        localStorage.setItem('stampCollection', JSON.stringify(this.stampCollection));
        localStorage.setItem('courseProgress', JSON.stringify(this.courseProgress));
        localStorage.setItem('visitHistory', JSON.stringify(this.visitHistory));
        if (typeof this.permissionRequested === 'boolean') {
            localStorage.setItem('permissionRequested', JSON.stringify(this.permissionRequested));
        }
        if (typeof this.hasLocationPermission === 'boolean') {
            localStorage.setItem('locationPermissionGranted', JSON.stringify(this.hasLocationPermission));
        }
    }

    // データ書き出し
    exportData() {
    const payload = {
        exportedAt: new Date().toISOString(),
        nickname: this.nickname,
        mode: this.currentMode,
        course: this.currentCourse,
        stampCollection: this.stampCollection,
        courseProgress: this.courseProgress,
        visitHistory: this.visitHistory
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toyooka-stamp-export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    }

    // データ初期化
    resetData() {
        if (!confirm('すべてのローカルデータを削除します。よろしいですか？')) return;

        // 背景設定は残したい場合はここを保存
        const brushBg = localStorage.getItem('brushBgEnabled');

        localStorage.clear();

        if (brushBg !== null) {
            localStorage.setItem('brushBgEnabled', brushBg);
        }

        // 内部状態も初期化
        this.currentMode = null;
        this.currentCourse = null;
        this.currentTab = 'map';
        this.userLocation = null;
        this.stampCollection = {};
        this.courseProgress = {};
        this.visitHistory = [];
        this.hasLocationPermission = false;
        this.permissionRequested = false;
        this.openAccordions.clear();

        // 画面をリロードしてクリーンに戻す
        window.location.hash = '';
        window.location.reload();
    }

    // 背景の筆ブラシ風トグル
    setBrushBgEnabled(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.add('brush-bg');
        } else {
            body.classList.remove('brush-bg');
        }
        localStorage.setItem('brushBgEnabled', JSON.stringify(enabled));
        const toggle = document.getElementById('brush-bg-toggle');
        if (toggle) toggle.checked = !!enabled;
      }
}

// --- Prototype拡張: switchTab を suppressHash オプション対応にする ---
// これはクラス定義の後で行えば既存インスタンスにも適用されます
ToyookaStampApp.prototype.switchTab = function(tab, { suppressHash = false } = {}) {
    // 全画面を非表示
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));

    // 対応スクリーンID
    const screenMap = {
        'map': 'map-view',
        'nearby': 'nearby-view',
        'courses': 'courses-view',
        'profile': 'profile-view',
        'settings': 'settings-view'
    };
    const screenId = screenMap[tab] || 'landing';
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');

    // タブバー状態
    document.querySelectorAll('.tab').forEach(t => t.setAttribute('data-active', 'false'));
    const btn = document.querySelector(`[data-tab="${tab}"]`);
    if (btn) btn.setAttribute('data-active', 'true');

    this.currentTab = tab;

    // タブに応じた描画
    if (tab === 'map') {
        this.renderMapContent();
        this.initializeMap();
    } else if (tab === 'nearby') {
        this.renderNearbyContent();
    } else if (tab === 'profile') {
        this.updateProfileData();
    } else if (tab === 'settings') {
        this.updateSettingsData();
    }

    if (!suppressHash) this.updateHash();
};

// ====== アプリ起動はデータ読み込み完了後に行う (fetch 版の正しい順序) ======
appInitPromise
  .then(() => {
    // データが揃ってからアプリを作成
    const app = new ToyookaStampApp();
    window.app = app;

    // 背景設定の初期適用（app が存在することが前提）
    (function initBrushBg() {
      const saved = JSON.parse(localStorage.getItem('brushBgEnabled') || 'true');
      app.setBrushBgEnabled(saved);
    })();

    // 安全ラッパの登録（app が存在しなければ呼ばれない）
    window.switchTab = (tab) => window.app && window.app.switchTab(tab);
    window.selectMode = (mode) => window.app && window.app.selectMode(mode);
    window.showModeSelect = () => window.app && window.app.showModeSelect();
    window.continueCourse = () => window.app && window.app.continueCourse();
    window.startCourse = (slug) => window.app && window.app.startCourse(slug);
    window.closeCourseDetail = () => window.app && window.app.closeCourseDetail();
    window.closeSpotDetail = () => window.app && window.app.closeSpotDetail();
    window.toggleBrushBackground = () => {
      const chk = document.getElementById('brush-bg-toggle');
      if (window.app) window.app.setBrushBgEnabled(chk ? chk.checked : true);
    };

    // 初期表示のハッシュ処理等が必要ならここで実行（app.checkInitialState() は constructor 内で既に呼ばれる）
  })
  .catch(err => {
    // 初期化（データ読み込み）に失敗した場合のフォールバック表示
    console.error('アプリ初期化失敗:', err);
    // 画面にエラーメッセージ表示する例:
    const main = document.getElementById('main-app');
    if (main) {
      main.innerHTML = '<div style="padding:1rem;color:#b91c1c;">データの読み込みに失敗しました。コンソールのエラーメッセージを確認してください。</div>';
    }
  });