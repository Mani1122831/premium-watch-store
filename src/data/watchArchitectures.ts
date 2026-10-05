export interface ComponentLayer {
  id: string;
  name: string;
  stage: string;
  explodedOffset: number;
  description: string;
  color: string;
}

export interface WatchArchitecture {
  slug: string;
  modelType: 'mechanical' | 'smartwatch' | 'chronograph' | 'diver' | 'minimal' | 'jewelry';
  primaryMetal: string;
  dialColor: string;
  strapColor: string;
  layers: ComponentLayer[];
}

export const WATCH_ARCHITECTURES: Record<string, WatchArchitecture> = {
  // 1. Meridian Classic Gold
  'meridian-classic-gold': {
    slug: 'meridian-classic-gold',
    modelType: 'mechanical',
    primaryMetal: '#d4a017',
    dialColor: '#f5e6c8',
    strapColor: '#5c3a1e',
    layers: [
      { id: 'crystal', name: 'Anti-Reflective Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Double-domed scratch-proof sapphire crystal with multi-layer anti-reflective interior treatment.', color: '#88ccff' },
      { id: 'bezel', name: '18K Gold PVD Beveled Bezel', stage: 'Phase 3: Case Architecture', explodedOffset: -130, description: 'Diamond-turned 18K yellow gold PVD chamfered bezel providing a hermetic seal against dust and humidity.', color: '#d4a017' },
      { id: 'hands', name: 'Faceted Gold Dauphine Hands', stage: 'Phase 2: Hand Calibration', explodedOffset: -85, description: 'Micro-polished 18K gold dauphine hands with blued steel central seconds counterweight.', color: '#f3d07a' },
      { id: 'dial', name: 'Champagne Sunburst Dial & Indices', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Engine-turned champagne sunburst dial with hand-applied faceted gold Roman numerals and TITANOVA insignia.', color: '#f5e6c8' },
      { id: 'movement', name: 'High-Torque Swiss Quartz Calibre', stage: 'Phase 1: Power Assembly', explodedOffset: 20, description: 'Precision Swiss quartz calibre with jeweled bearings and end-of-life battery indication system.', color: '#d4a017' },
      { id: 'case', name: '18K Gold PVD 316L Middle Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 80, description: 'Cold-forged surgical 316L stainless steel case with knurled crown and integrated O-ring gaskets.', color: '#d4a017' },
      { id: 'caseback', name: 'Threaded 18K Gold Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Screw-down gold-plated caseback with engraved atelier serial number certifying 50m water resistance.', color: '#d4a017' },
      { id: 'strap', name: 'Hand-Stitched Italian Leather Strap', stage: 'Phase 4: Ergonomic Fitment', explodedOffset: 210, description: 'Full-grain Italian saddle leather strap with contrast perimeter stitching and gold deployment clasp.', color: '#5c3a1e' },
    ],
  },

  // 2. Titanova Chronograph Black
  'titanova-chronograph-black': {
    slug: 'titanova-chronograph-black',
    modelType: 'chronograph',
    primaryMetal: '#1c1c20',
    dialColor: '#121214',
    strapColor: '#1c1c20',
    layers: [
      { id: 'crystal', name: 'Anti-Reflective Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Flat high-impact sapphire crystal with dual-sided anti-reflective treatment.', color: '#88ccff' },
      { id: 'bezel', name: 'Ceramic Tachymeter Bezel', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'Hardened black ceramic bezel with laser-engraved white tachymeter speed calibration scale.', color: '#25262c' },
      { id: 'hands', name: 'Rose Gold Chrono Hands & Pointers', stage: 'Phase 2: Dial Hands Mounting', explodedOffset: -85, description: 'Rose gold faceted main hands with three distinct sub-dial measurement indicators.', color: '#e8b4b8' },
      { id: 'dial', name: 'Tri-Compax Chronograph Dial', stage: 'Phase 2: Register Alignment', explodedOffset: -40, description: 'Multi-layer matte black dial with triple recessed sub-dials (60s, 30m, 12h) and date window.', color: '#121214' },
      { id: 'movement', name: 'Swiss Calibre 17 Chronograph Movement', stage: 'Phase 1: Chronograph Calibre', explodedOffset: 20, description: 'High-frequency automatic chronograph calibre with column-wheel system and skeletonized rotor.', color: '#d4a017' },
      { id: 'case', name: 'Obsidian PVD Case & Dual Pushers', stage: 'Phase 1: Middle Case Construction', explodedOffset: 80, description: 'Surgical stainless steel coated in diamond-like obsidian PVD with two sealed chrono pushers.', color: '#1c1c20' },
      { id: 'caseback', name: 'Exhibition Sapphire Caseback', stage: 'Phase 4: Caseback Fastening', explodedOffset: 145, description: 'Threaded black PVD caseback featuring exhibition sapphire window showing oscillating weight.', color: '#1c1c20' },
      { id: 'strap', name: 'Solid Link Black PVD Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Brushed black PVD stainless steel links with dual-push safety deployant mechanism.', color: '#1c1c20' },
    ],
  },

  // 3. Titanova Heritage Steel
  'titanova-heritage-steel': {
    slug: 'titanova-heritage-steel',
    modelType: 'mechanical',
    primaryMetal: '#c8c8cc',
    dialColor: '#f0f0f3',
    strapColor: '#7a4828',
    layers: [
      { id: 'crystal', name: 'Domed Box Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Vintage-inspired domed box sapphire crystal with anti-glare interior coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Mirror-Polished 316L Steel Bezel', stage: 'Phase 3: Case Architecture', explodedOffset: -130, description: 'Concentric diamond-turned 316L stainless steel polished bezel ring.', color: '#d8d8dc' },
      { id: 'hands', name: 'Diamond-Cut Steel Dauphine Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Hand-beveled surgical steel dauphine hands with needle seconds indicator.', color: '#e0e0e4' },
      { id: 'dial', name: 'Sunburst Silver Opaline Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Opaline silver dial with applied polished hour markers and black minute chapter ring.', color: '#f0f0f3' },
      { id: 'movement', name: 'Swiss High-Beat Mechanical Calibre', stage: 'Phase 1: Calibre Installation', explodedOffset: 20, description: '28,800 vph mechanical automatic movement with Glucydur balance wheel and Incabloc shock protection.', color: '#c8c8cc' },
      { id: 'case', name: 'Brushed 316L Surgical Steel Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 80, description: 'Monobloc surgical steel case with satin-brushed flanks and fluted push-pull crown.', color: '#c0c0c5' },
      { id: 'caseback', name: 'Engraved 316L Solid Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Screwed solid steel caseback with laser-engraved TITANOVA heritage coat of arms.', color: '#c0c0c5' },
      { id: 'strap', name: 'Cognac Saddle Leather Strap', stage: 'Phase 4: Strap Assembly', explodedOffset: 210, description: 'Supple vegetable-tanned French calfskin strap with brushed steel pin buckle.', color: '#7a4828' },
    ],
  },

  // 4. Titanova Royal Automatic
  'titanova-royal-automatic': {
    slug: 'titanova-royal-automatic',
    modelType: 'mechanical',
    primaryMetal: '#d49b6a',
    dialColor: '#1b2d4f',
    strapColor: '#452b1b',
    layers: [
      { id: 'crystal', name: 'Double-Curved Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Curved sapphire crystal engineered to withstand atmospheric rate variations.', color: '#88ccff' },
      { id: 'bezel', name: '18K Rose Gold Decorative Bezel', stage: 'Phase 3: Case Architecture', explodedOffset: -130, description: 'Polished 18K rose gold bezel with precision micro-beveled rim.', color: '#d49b6a' },
      { id: 'hands', name: 'Faceted Rose Gold Leaf Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Elegantly sculpted rose gold leaf hands counterbalanced to one-hundredth gram precision.', color: '#f3c49e' },
      { id: 'dial', name: 'Midnight Blue Guilloché Dial', stage: 'Phase 2: Open-Heart Dial', explodedOffset: -40, description: 'Hand-turned engine guilloché dial with circular aperture exposing oscillating balance wheel.', color: '#1b2d4f' },
      { id: 'movement', name: '26-Jewel Swiss Automatic Calibre', stage: 'Phase 1: Escapement Calibration', explodedOffset: 20, description: 'In-house tuned automatic movement with 22K gold skeleton rotor and Côtes de Genève finish.', color: '#d4a017' },
      { id: 'case', name: '18K Rose Gold Monobloc Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 80, description: 'Solid 18K rose gold-plated middle case featuring knurled crown with embossed T monogram.', color: '#d49b6a' },
      { id: 'caseback', name: 'Exhibition Sapphire Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Threaded sapphire exhibition back with 6 blued screws and water resistance seal.', color: '#d49b6a' },
      { id: 'strap', name: 'Brown Alligator Leather Strap', stage: 'Phase 4: Clasp Integration', explodedOffset: 210, description: 'Hand-stitched genuine alligator skin strap with 18K rose gold double-folding clasp.', color: '#452b1b' },
    ],
  },

  // 5. Titanova Elegance Gold
  'titanova-elegance-gold': {
    slug: 'titanova-elegance-gold',
    modelType: 'jewelry',
    primaryMetal: '#d4a017',
    dialColor: '#f7edcb',
    strapColor: '#d4a017',
    layers: [
      { id: 'crystal', name: 'Beveled Scratch-Resistant Sapphire', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Diamond-hard beveled sapphire crystal with crystal-clear high-definition clarity.', color: '#88ccff' },
      { id: 'bezel', name: '18K Yellow Gold Polished Bezel', stage: 'Phase 3: Jewel Enclosure', explodedOffset: -130, description: 'High-polish 18K yellow gold slim bezel engineered for delicate dress watch proportions.', color: '#d4a017' },
      { id: 'hands', name: 'Slender Gold Baton Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Ultra-thin gold baton hands calibrated for silent and jitter-free timekeeping.', color: '#ecd070' },
      { id: 'dial', name: 'Radiant Champagne Sunray Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Sunray lacquered champagne dial with minimal baton hour markers and golden insignia.', color: '#f7edcb' },
      { id: 'movement', name: 'Ultra-Slim Swiss Quartz Calibre', stage: 'Phase 1: Quartz Calibre', explodedOffset: 20, description: 'Jeweled ultra-flat Swiss movement guaranteeing +-10 seconds per year accuracy.', color: '#d4a017' },
      { id: 'case', name: '18K Yellow Gold Slimline Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 80, description: 'Ultra-slim 7.2mm yellow gold PVD case with synthetic sapphire cabochon crown.', color: '#d4a017' },
      { id: 'caseback', name: 'Polished 18K Gold Snap Back', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Mirror-polished caseback with bespoke monogram engraving and 30m water seal.', color: '#d4a017' },
      { id: 'strap', name: 'Integrated 5-Link Gold Bracelet', stage: 'Phase 4: Jewel Bracelet', explodedOffset: 210, description: 'Fluid 5-link articulated gold bracelet with concealed butterfly deployment clasp.', color: '#d4a017' },
    ],
  },

  // 6. Titanova Pearl Silver
  'titanova-pearl-silver': {
    slug: 'titanova-pearl-silver',
    modelType: 'jewelry',
    primaryMetal: '#d8d8dc',
    dialColor: '#f4f5f8',
    strapColor: '#c8c8cc',
    layers: [
      { id: 'crystal', name: 'Anti-Reflective Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -190, description: 'Double-curved scratch-resistant sapphire crystal with anti-reflective interior treatment.', color: '#88ccff' },
      { id: 'bezel', name: 'Mirror-Polished Surgical Steel Bezel', stage: 'Phase 3: Case Architecture', explodedOffset: -150, description: 'Micro-radiused mirror-polished 316L stainless steel bezel providing a tight optical seal.', color: '#d8d8dc' },
      { id: 'seconds_hand', name: 'High-Precision Seconds Hand', stage: 'Phase 2: Hand Calibration', explodedOffset: -115, description: 'Ultralight polished rhodium seconds needle offering sweep accuracy.', color: '#e8e8ec' },
      { id: 'minute_hand', name: 'Polished Silver Minute Hand', stage: 'Phase 2: Hand Calibration', explodedOffset: -90, description: 'Hand-beveled silver leaf minute hand calibrated for delicate proportions.', color: '#e0e0e5' },
      { id: 'hour_hand', name: 'Polished Silver Hour Hand', stage: 'Phase 2: Hand Calibration', explodedOffset: -65, description: 'Faceted silver leaf hour hand counterweighted for flawless balance.', color: '#d8d8dc' },
      { id: 'dial', name: 'Natural White Mother-of-Pearl Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -35, description: 'Natural Australian mother-of-pearl dial with 12 diamond-cut crystal hour markers.', color: '#f4f5f8' },
      { id: 'movement', name: 'Swiss Precision Quartz Movement', stage: 'Phase 1: Calibre Assembly', explodedOffset: 25, description: 'Low-friction Swiss quartz calibre with ruby bearings and 5-year battery reserve.', color: '#c8c8cc' },
      { id: 'case', name: 'Polished 316L Curved Steel Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 85, description: 'Cold-forged surgical 316L stainless steel case with contoured lugs and fluted crown.', color: '#d0d0d5' },
      { id: 'caseback', name: 'Threaded Steel Caseback with Window', stage: 'Phase 4: Hermetic Seal', explodedOffset: 150, description: 'Laser-etched surgical steel threaded caseback with mineral exhibition window and 30m water seal.', color: '#d0d0d5' },
      { id: 'strap', name: 'Milanese Mesh Steel Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 215, description: 'Fine-woven Milanese mesh 316L stainless steel bracelet with dual-lock deployment clasp.', color: '#c8c8cc' },
    ],
  },

  // 7. Titanova Rose Classic
  'titanova-rose-classic': {
    slug: 'titanova-rose-classic',
    modelType: 'mechanical',
    primaryMetal: '#d49b80',
    dialColor: '#f9eee8',
    strapColor: '#d49b80',
    layers: [
      { id: 'crystal', name: 'Domed Sapphire Crystal Glass', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Domed sapphire crystal with internal anti-reflective glare coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Rose Gold Diamond-Turned Bezel', stage: 'Phase 3: Case Architecture', explodedOffset: -130, description: 'Rose gold PVD chamfered bezel providing tight water resistance.', color: '#d49b80' },
      { id: 'hands', name: 'Rose Gold Faceted Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Polished rose gold dauphine hands with smooth sweep seconds.', color: '#f0c4b0' },
      { id: 'dial', name: 'Blush Rose Sunburst Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Blush rose sunburst dial with applied roman numerals and minute track.', color: '#f9eee8' },
      { id: 'movement', name: '21-Jewel Automatic Movement', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: 'Self-winding mechanical calibre with 40-hour power reserve.', color: '#d4a017' },
      { id: 'case', name: 'Rose Gold PVD Coated Steel Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 80, description: 'Surgical stainless steel case with rose gold PVD coating and knurled crown.', color: '#d49b80' },
      { id: 'caseback', name: 'Exhibition Sapphire Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Threaded exhibition caseback showing decorated mechanical movement.', color: '#d49b80' },
      { id: 'strap', name: 'Rose Gold 3-Link Steel Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Brushed and polished 3-link rose gold bracelet with deployant clasp.', color: '#d49b80' },
    ],
  },

  // 8. Titanova Luxe Black
  'titanova-luxe-black': {
    slug: 'titanova-luxe-black',
    modelType: 'minimal',
    primaryMetal: '#18181b',
    dialColor: '#09090b',
    strapColor: '#18181b',
    layers: [
      { id: 'crystal', name: 'Oleophobic Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Flat sapphire glass with anti-fingerprint and scratch-resistant coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Obsidian PVD Satin Bezel', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'Deep obsidian black PVD stainless steel satin-finished bezel ring.', color: '#27272a' },
      { id: 'hands', name: 'Stealth Black Skeleton Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Matte black hands with micro-luminous anthracite tips.', color: '#52525b' },
      { id: 'dial', name: 'Velvet Black Minimalist Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Deep non-reflective velvet black dial with stealth indices.', color: '#09090b' },
      { id: 'movement', name: 'High-Torque Swiss Quartz Calibre', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: 'Precision Swiss quartz movement engineered for high durability.', color: '#3f3f46' },
      { id: 'case', name: 'Obsidian Coated Surgical Steel Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 80, description: 'Surgical steel middle case with textured crown and gasket seals.', color: '#18181b' },
      { id: 'caseback', name: 'Screwed Solid Obsidian Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Threaded solid PVD caseback certified to 50m water resistance.', color: '#18181b' },
      { id: 'strap', name: 'Obsidian PVD Oyster Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Solid link black PVD oyster bracelet with dual push-button safety clasp.', color: '#18181b' },
    ],
  },

  // 9. Titanova Smart X1
  'titanova-smart-x1': {
    slug: 'titanova-smart-x1',
    modelType: 'smartwatch',
    primaryMetal: '#3f3f46',
    dialColor: '#000000',
    strapColor: '#27272a',
    layers: [
      { id: 'crystal', name: '3D Curved Corning Gorilla Glass DX', stage: 'Phase 3: Display Cover', explodedOffset: -180, description: 'Chemically strengthened cover glass with diamond-like anti-scratch coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Aerospace 7000 Series Aluminium Bezel', stage: 'Phase 3: Chassis Frame', explodedOffset: -130, description: 'CNC machined aerospace-grade 7000 aluminum alloy bezel ring.', color: '#52525b' },
      { id: 'display', name: '1.43" Ultra-HD AMOLED Touch Matrix', stage: 'Phase 2: Screen Calibration', explodedOffset: -85, description: '466x466 high-resolution AMOLED display with 1000 nits peak brightness.', color: '#38bdf8' },
      { id: 'processor', name: 'Dual-Core SPU & Biosensor Logic Board', stage: 'Phase 2: SPU Motherboard', explodedOffset: -40, description: 'Ultra-low power neural computing engine with Bluetooth 5.3 and GNSS chipsets.', color: '#22c55e' },
      { id: 'battery', name: 'High-Density Lithium-Polymer Cell', stage: 'Phase 1: Energy Storage', explodedOffset: 20, description: '420mAh custom-shaped fast-charging battery with 7-day runtime.', color: '#eab308' },
      { id: 'case', name: 'Aerospace Aluminium Unibody Chassis', stage: 'Phase 1: Structural Chassis', explodedOffset: 80, description: 'Precision unibody chassis with digital haptic crown and speaker acoustic ports.', color: '#3f3f46' },
      { id: 'sensorbase', name: 'Zirconia Ceramic Optical Sensor Array', stage: 'Phase 4: Sensor Integration', explodedOffset: 145, description: '8-channel PPG heart rate, SpO2 sensor base with magnetic fast-charge pins.', color: '#27272a' },
      { id: 'strap', name: 'Fluoroelastomer Sport Band', stage: 'Phase 4: Band Fitment', explodedOffset: 210, description: 'Sweat-resistant textured fluoroelastomer sport strap with quick-release bars.', color: '#27272a' },
    ],
  },

  // 10. Titanova Smart Pro
  'titanova-smart-pro': {
    slug: 'titanova-smart-pro',
    modelType: 'smartwatch',
    primaryMetal: '#27272a',
    dialColor: '#000000',
    strapColor: '#18181b',
    layers: [
      { id: 'crystal', name: 'Sapphire Glass Touch Cover Glass', stage: 'Phase 3: Display Cover', explodedOffset: -180, description: 'Synthetic sapphire glass with Mohs hardness 9 for extreme scratch resistance.', color: '#88ccff' },
      { id: 'bezel', name: 'Grade 5 Titanium Bezel with DLC Ring', stage: 'Phase 3: Armor Ring', explodedOffset: -130, description: 'Brushed Grade 5 titanium bezel fortified with carbon diamond-like coating.', color: '#52525b' },
      { id: 'display', name: 'Always-On Sapphire AMOLED Module', stage: 'Phase 2: Display Alignment', explodedOffset: -85, description: 'Vibrant circular AMOLED panel supporting multi-touch gesture control.', color: '#38bdf8' },
      { id: 'processor', name: 'Advanced AI Biometric SoC Engine', stage: 'Phase 2: Processor Core', explodedOffset: -40, description: 'High-speed quad-core processor with onboard ECG and dual-frequency GPS.', color: '#22c55e' },
      { id: 'battery', name: 'Extended 500mAh Solid-State Battery', stage: 'Phase 1: Energy Hub', explodedOffset: 20, description: 'High-capacity battery delivering up to 14 days of power.', color: '#eab308' },
      { id: 'case', name: 'Titanium & DLC Rugged Monobloc Body', stage: 'Phase 1: Armor Chassis', explodedOffset: 80, description: 'Machined titanium housing with knurled buttons and 5 ATM water seals.', color: '#27272a' },
      { id: 'sensorbase', name: 'Medical Ceramic Bio-Sensor Base', stage: 'Phase 4: Base Hermetic Seal', explodedOffset: 145, description: 'Polished ceramic base housing multi-wavelength PPG diodes and wireless charging coil.', color: '#18181b' },
      { id: 'strap', name: 'Titanium Link DLC Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Grade 5 titanium bracelet with diamond-like carbon coating and micro-adjust clasp.', color: '#18181b' },
    ],
  },

  // 11. Titanova Connect
  'titanova-connect': {
    slug: 'titanova-connect',
    modelType: 'smartwatch',
    primaryMetal: '#71717a',
    dialColor: '#000000',
    strapColor: '#27272a',
    layers: [
      { id: 'crystal', name: '2.5D Curved Tempered Crystal', stage: 'Phase 3: Screen Enclosure', explodedOffset: -180, description: 'Curved edge-to-edge tempered glass with oil-resistant surface coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Beveled Polished Aluminium Perimeter', stage: 'Phase 3: Chassis Frame', explodedOffset: -130, description: 'Polished aluminum perimeter bezel designed for modern clean lines.', color: '#a1a1aa' },
      { id: 'display', name: 'Retina-Grade AMOLED Touchscreen', stage: 'Phase 2: Touch Matrix', explodedOffset: -85, description: 'High-contrast AMOLED display delivering rich colors and sharp watch faces.', color: '#38bdf8' },
      { id: 'processor', name: 'Connected BLE 5.3 SoC Board', stage: 'Phase 2: SPU Architecture', explodedOffset: -40, description: 'Low-energy wireless SoC handling notifications, calls, and sensor telemetry.', color: '#22c55e' },
      { id: 'battery', name: 'Fast-Charging Lithium Cell', stage: 'Phase 1: Power Source', explodedOffset: 20, description: 'Compact fast-charge battery providing 5-day continuous connection.', color: '#eab308' },
      { id: 'case', name: 'CNC Machined Aluminium Chassis', stage: 'Phase 1: Foundation Body', explodedOffset: 80, description: 'Lightweight brushed aluminum chassis with multifunction crown button.', color: '#71717a' },
      { id: 'sensorbase', name: 'Composite Optical Pulse Sensor Dock', stage: 'Phase 4: Sensor Plate', explodedOffset: 145, description: 'Sealed polymer sensor plate with magnetic charging connector terminals.', color: '#27272a' },
      { id: 'strap', name: 'Flexible High-Grade Silicone Strap', stage: 'Phase 4: Band Fitment', explodedOffset: 210, description: 'Supple silicone band with stainless steel buckle for all-day comfort.', color: '#27272a' },
    ],
  },

  // 12. Titanova Elite Smart
  'titanova-elite-smart': {
    slug: 'titanova-elite-smart',
    modelType: 'smartwatch',
    primaryMetal: '#d49b80',
    dialColor: '#000000',
    strapColor: '#e4c4b8',
    layers: [
      { id: 'crystal', name: 'Curved Sapphire Glass with Gold Rim', stage: 'Phase 3: Screen Cover', explodedOffset: -180, description: 'Curved sapphire glass with micro-gold rim edge gasket.', color: '#88ccff' },
      { id: 'bezel', name: 'Rose Gold PVD Diamond-Cut Bezel', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'Rose gold PVD aluminum bezel with diamond-cut chamfered edges.', color: '#d49b80' },
      { id: 'display', name: 'Vibrant Circular AMOLED Display', stage: 'Phase 2: Display Alignment', explodedOffset: -85, description: 'Full-color AMOLED panel with customizable luxury horology watch dials.', color: '#38bdf8' },
      { id: 'processor', name: 'Wellness & Health Biosensor Board', stage: 'Phase 2: Core Processor', explodedOffset: -40, description: 'Precision processor board dedicated to heart rate, stress, and sleep monitoring.', color: '#22c55e' },
      { id: 'battery', name: 'Micro-Lithium Battery Module', stage: 'Phase 1: Power Unit', explodedOffset: 20, description: 'High-density micro-cell battery supporting 5 days of smart health tracking.', color: '#eab308' },
      { id: 'case', name: 'Rose Gold Lightweight Aluminium Case', stage: 'Phase 1: Foundation Case', explodedOffset: 80, description: 'Rose gold anodized chassis with gemstone-accented digital crown.', color: '#d49b80' },
      { id: 'sensorbase', name: 'Polished White Ceramic Sensor Base', stage: 'Phase 4: Base Assembly', explodedOffset: 145, description: 'Hypoallergenic white zirconia ceramic base with biometric sensor window.', color: '#f4f4f5' },
      { id: 'strap', name: 'Italian Suede & Silicone Hybrid Strap', stage: 'Phase 4: Strap Attachment', explodedOffset: 210, description: 'Dust-resistant blush pink strap with rose gold pin buckle.', color: '#e4c4b8' },
    ],
  },

  // 13. Vanguard Diver 200
  'vanguard-diver-200': {
    slug: 'vanguard-diver-200',
    modelType: 'diver',
    primaryMetal: '#c4c4c8',
    dialColor: '#0a192f',
    strapColor: '#1e293b',
    layers: [
      { id: 'crystal', name: '3.5mm Double-Domed Sapphire Crystal', stage: 'Phase 3: Deep-Pressure Crystal', explodedOffset: -180, description: 'Reinforced 3.5mm thick sapphire crystal engineered for 200m / 20 ATM water pressure.', color: '#88ccff' },
      { id: 'bezel', name: '120-Click Ceramic Diver Bezel', stage: 'Phase 3: Rotating Bezel', explodedOffset: -130, description: 'Unidirectional rotating bezel with luminous ceramic diver countdown scale.', color: '#0f172a' },
      { id: 'hands', name: 'Super-LumiNova BGW9 Diver Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'High-visibility oversized arrow hands coated in blue Super-LumiNova.', color: '#38bdf8' },
      { id: 'dial', name: 'Deep Sea Blue Diver Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Deep ocean blue matte dial with bold geometric luminescent hour markers.', color: '#0a192f' },
      { id: 'movement', name: 'Swiss ETA 2824-2 Automatic Calibre', stage: 'Phase 1: Calibre Mounting', explodedOffset: 20, description: 'Robust high-reliability automatic mechanical movement with 38-hour power reserve.', color: '#c4c4c8' },
      { id: 'case', name: '316L Heavy-Duty Surgical Steel Case', stage: 'Phase 1: Foundation Monobloc', explodedOffset: 80, description: 'Surgical steel diver case with helium escape valve and screw-down crown.', color: '#b4b4b8' },
      { id: 'caseback', name: 'Threaded Solid Caseback with Diver Icon', stage: 'Phase 4: 200M Hermetic Seal', explodedOffset: 145, description: 'Heavy-duty steel caseback with certified 20 ATM high-pressure rubber O-ring.', color: '#b4b4b8' },
      { id: 'strap', name: 'Reinforced Vulcanized Rubber Strap', stage: 'Phase 4: Strap Assembly', explodedOffset: 210, description: 'Saltwater-resistant vulcanized rubber diving strap with diver extension clasp.', color: '#1e293b' },
    ],
  },

  // 14. Grid Urban Steel
  'grid-urban-steel': {
    slug: 'grid-urban-steel',
    modelType: 'minimal',
    primaryMetal: '#c8c8cc',
    dialColor: '#f1f1f4',
    strapColor: '#c8c8cc',
    layers: [
      { id: 'crystal', name: 'Scratch-Proof Mineral Glass', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Flat high-hardness mineral crystal with anti-scratch coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Minimalist Ultra-Thin Steel Bezel', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'Clean ultra-narrow steel bezel highlighting the expansive watch face.', color: '#d8d8dc' },
      { id: 'hands', name: 'Needle-Thin Polished Steel Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Laser-cut minimalist needle hands for crisp, uncluttered timekeeping.', color: '#e0e0e4' },
      { id: 'dial', name: 'Architectural Grid-Pattern Silver Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Micro-engraved architectural grid pattern on sunburst silver dial.', color: '#f1f1f4' },
      { id: 'movement', name: 'Slimline Japanese Quartz Movement', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: 'Ultra-slim 2.8mm quartz calibre with high power efficiency.', color: '#c8c8cc' },
      { id: 'case', name: '38mm Brushed 316L Monobloc Case', stage: 'Phase 1: Foundation Casing', explodedOffset: 80, description: 'Compact 38mm brushed stainless steel case with recessed crown.', color: '#c0c0c5' },
      { id: 'caseback', name: 'Snapped Minimalist Steel Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Flush snap-fit stainless steel caseback with 30m water resistance.', color: '#c0c0c5' },
      { id: 'strap', name: 'Milanese Mesh Steel Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Smooth woven stainless steel Milanese mesh bracelet with sliding buckle.', color: '#c8c8cc' },
    ],
  },

  // 15. Terra Forest Automatic
  'terra-forest-automatic': {
    slug: 'terra-forest-automatic',
    modelType: 'mechanical',
    primaryMetal: '#c0c0c5',
    dialColor: '#1b3b22',
    strapColor: '#1b3b22',
    layers: [
      { id: 'crystal', name: 'Domed Sapphire Crystal with Glare Filter', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Scratch-resistant domed sapphire crystal with anti-reflective treatment.', color: '#88ccff' },
      { id: 'bezel', name: 'Satin-Brushed Steel Bezel', stage: 'Phase 3: Bezel Architecture', explodedOffset: -130, description: 'Brushed stainless steel bezel with hand-polished edge bevels.', color: '#d0d0d5' },
      { id: 'hands', name: 'Rhodium-Plated Faceted Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Rhodium-plated faceted dauphine hands with luminous inlay.', color: '#e8e8ec' },
      { id: 'dial', name: 'Sunburst Forest Green Dial', stage: 'Phase 2: Dial Alignment', explodedOffset: -40, description: 'Radiant forest green radial dial with hand-applied rhodium indices.', color: '#1b3b22' },
      { id: 'movement', name: 'Swiss ETA 2824-2 Mechanical Calibre', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: '25-jewel Swiss automatic movement with 38-hour power reserve.', color: '#c0c0c5' },
      { id: 'case', name: 'Satin-Finished 316L Steel Case', stage: 'Phase 1: Middle Case', explodedOffset: 80, description: 'Cold-forged steel case with fluted crown and high-pressure gasket.', color: '#b8b8bd' },
      { id: 'caseback', name: 'Exhibition Sapphire Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Screw-in sapphire caseback revealing decorated rotor and Geneva stripes.', color: '#b8b8bd' },
      { id: 'strap', name: 'Forest Green Vulcanized Rubber Strap', stage: 'Phase 4: Strap Assembly', explodedOffset: 210, description: 'Custom-molded forest green rubber strap with steel folding deployment clasp.', color: '#1b3b22' },
    ],
  },

  // 16. Noir Chronograph Gold
  'noir-chronograph-gold': {
    slug: 'noir-chronograph-gold',
    modelType: 'chronograph',
    primaryMetal: '#1c1c20',
    dialColor: '#101012',
    strapColor: '#141416',
    layers: [
      { id: 'crystal', name: 'Anti-Reflective Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Scratch-resistant sapphire crystal with anti-glare coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Matte Black Bezel with Gold Accents', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'PVD black bezel accented with gilded tachymeter numerals.', color: '#27272a' },
      { id: 'hands', name: '18K Gold Faceted Chronograph Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Polished gold main hands and three precision sub-dial pointers.', color: '#e2b83d' },
      { id: 'dial', name: 'Jet Black Dial with Gold Sub-Dials', stage: 'Phase 2: Register Alignment', explodedOffset: -40, description: 'Multi-tiered jet black dial featuring three gold-rimmed chronograph registers.', color: '#101012' },
      { id: 'movement', name: 'Miyota Precision Quartz Chrono Movement', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: 'High-accuracy chronograph quartz movement measuring 1/10th seconds.', color: '#d4a017' },
      { id: 'case', name: 'PVD Black Steel Case & Gold Pushers', stage: 'Phase 1: Foundation Case', explodedOffset: 80, description: 'Black PVD steel middle case with contrasting 18K gold-plated pushers.', color: '#1c1c20' },
      { id: 'caseback', name: 'Screwed PVD Black Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Screwed solid caseback with engraved serial certifying 50m water resistance.', color: '#1c1c20' },
      { id: 'strap', name: 'Perforated Racing Leather Strap', stage: 'Phase 4: Strap Assembly', explodedOffset: 210, description: 'Perforated black calfskin racing strap with contrast gold stitching.', color: '#141416' },
    ],
  },

  // 17. Helix Sport Automatic
  'helix-sport-automatic': {
    slug: 'helix-sport-automatic',
    modelType: 'mechanical',
    primaryMetal: '#c4c4c8',
    dialColor: '#18181b',
    strapColor: '#18181b',
    layers: [
      { id: 'crystal', name: 'Anti-Reflective Sapphire Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Sapphire crystal with multi-layer interior anti-reflective treatment.', color: '#88ccff' },
      { id: 'bezel', name: 'Black & Crimson Ceramic Bezel', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'Bidirectional ceramic bezel with red accent quarter-hour scale.', color: '#991b1b' },
      { id: 'hands', name: 'Skeletonized Sport Hands & Red Seconds', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Luminescent skeleton hands with vibrant crimson red sweep seconds hand.', color: '#ef4444' },
      { id: 'dial', name: 'Carbon-Patterned Black Sport Dial', stage: 'Phase 2: Dial Alignment', explodedOffset: -40, description: 'Textured carbon-weave dial with bold applied luminous markers.', color: '#18181b' },
      { id: 'movement', name: 'Swiss ETA 2824 Extended Power Calibre', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: 'High-torque automatic calibre with custom red rotor and 72h power reserve.', color: '#c4c4c8' },
      { id: 'case', name: '316L Steel Case with Red Anodized Crown', stage: 'Phase 1: Foundation Case', explodedOffset: 80, description: 'Brushed steel case featuring crimson anodized aluminum crown collar.', color: '#b4b4b8' },
      { id: 'caseback', name: 'Exhibition Sapphire Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Threaded sapphire viewport displaying decorated mechanical bridges.', color: '#b4b4b8' },
      { id: 'strap', name: 'Vulcanized Black Sport Rubber Strap', stage: 'Phase 4: Strap Assembly', explodedOffset: 210, description: 'Textured ergonomic black rubber strap with steel safety folding clasp.', color: '#18181b' },
    ],
  },

  // 18. Aurelia Pearl Quartz
  'aurelia-pearl-quartz': {
    slug: 'aurelia-pearl-quartz',
    modelType: 'jewelry',
    primaryMetal: '#d4a017',
    dialColor: '#fae8dc',
    strapColor: '#d4a017',
    layers: [
      { id: 'crystal', name: 'Beveled Mineral Crystal Glass', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Clear mineral glass with precision beveled perimeter edges.', color: '#88ccff' },
      { id: 'bezel', name: '18K Gold-Plated Smooth Bezel', stage: 'Phase 3: Case Architecture', explodedOffset: -130, description: 'Hand-polished gold bezel highlighting warm sunrise peach dial hues.', color: '#d4a017' },
      { id: 'hands', name: 'Slender Gold-Tone Leaf Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Elegantly tapered gold leaf hands for graceful time indication.', color: '#ecd070' },
      { id: 'dial', name: 'Peach Mother-of-Pearl Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Warm peach-toned mother-of-pearl dial with applied Arabic numerals.', color: '#fae8dc' },
      { id: 'movement', name: 'Japanese Precision Quartz Calibre', stage: 'Phase 1: Quartz Calibre', explodedOffset: 20, description: 'High-reliability Japanese quartz movement with silent stepping.', color: '#d4a017' },
      { id: 'case', name: '18K Gold-Plated Stainless Steel Case', stage: 'Phase 1: Foundation Case', explodedOffset: 80, description: 'Curved gold-plated steel case with decorative knurled crown.', color: '#d4a017' },
      { id: 'caseback', name: 'Polished Snap-Down Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Gold-tone steel caseback with laser-engraved certification mark.', color: '#d4a017' },
      { id: 'strap', name: 'Integrated Gold Bangle Link Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Fluid jewelry-inspired gold-tone link bracelet with fold-over box clasp.', color: '#d4a017' },
    ],
  },

  // 19. Marquise Gold Bangle
  'marquise-gold-bangle': {
    slug: 'marquise-gold-bangle',
    modelType: 'jewelry',
    primaryMetal: '#d4a017',
    dialColor: '#fef3c7',
    strapColor: '#d4a017',
    layers: [
      { id: 'crystal', name: 'Faceted Beveled Mineral Crystal', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Diamond-faceted crystal creating sparkling light refractions.', color: '#88ccff' },
      { id: 'bezel', name: '18K Gold Diamond-Cut Bezel', stage: 'Phase 3: Jewel Bezel', explodedOffset: -130, description: 'Intricate diamond-cut textured 18K gold bezel rim.', color: '#d4a017' },
      { id: 'hands', name: 'Delicate Polished Gold Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Micro-polished golden hands proportioned for petite jewelry dial.', color: '#ecd070' },
      { id: 'dial', name: 'Champagne Dial with Roman Numerals', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Warm champagne lacquered dial with classic black Roman numerals.', color: '#fef3c7' },
      { id: 'movement', name: 'Micro-Quartz Precision Calibre', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: 'Compact miniaturized quartz calibre fitting jewelry cuff dimensions.', color: '#d4a017' },
      { id: 'case', name: '18K Gold Hinged Cuff Case', stage: 'Phase 1: Foundation Cuff', explodedOffset: 80, description: 'Seamless gold-plated brass case integrated into hinged cuff architecture.', color: '#d4a017' },
      { id: 'caseback', name: 'Concealed Hinge Gold Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Hidden caseback mechanism preserving exterior jewelry flow.', color: '#d4a017' },
      { id: 'strap', name: 'Sculpted 18K Gold Bangle Cuff', stage: 'Phase 4: Bangle Integration', explodedOffset: 210, description: 'Rigid gold-plated jewelry bangle cuff with spring-loaded catch.', color: '#d4a017' },
    ],
  },

  // 20. Epoch GMT Dual Time
  'epoch-gmt-dual-time': {
    slug: 'epoch-gmt-dual-time',
    modelType: 'mechanical',
    primaryMetal: '#c4c4c8',
    dialColor: '#111827',
    strapColor: '#c4c4c8',
    layers: [
      { id: 'crystal', name: 'Sapphire Crystal with Cyclops Magnifier', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Scratch-resistant sapphire crystal with 2.5x date cyclops magnification.', color: '#88ccff' },
      { id: 'bezel', name: '24-Hour Batman Ceramic Bezel', stage: 'Phase 3: Rotating Bezel', explodedOffset: -130, description: 'Bidirectional 24-hour dual-color blue and black ceramic bezel ring.', color: '#1e40af' },
      { id: 'hands', name: 'Mercedes Hands & Red GMT Arrow', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Luminescent Mercedes hour/minute hands and red 24-hour second-timezone arrow.', color: '#ef4444' },
      { id: 'dial', name: 'Midnight Black Dual-Time Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Deep gloss black dial with applied luminous hour markers and date at 3.', color: '#111827' },
      { id: 'movement', name: 'Swiss Automatic GMT Calibre', stage: 'Phase 1: GMT Calibre Assembly', explodedOffset: 20, description: 'Dual-time mechanical automatic movement with independently adjustable GMT hand.', color: '#c4c4c8' },
      { id: 'case', name: '316L Steel Case with Triplock Crown', stage: 'Phase 1: Foundation Case', explodedOffset: 80, description: 'Surgical stainless steel case with screw-down crown and protective shoulder guards.', color: '#b4b4b8' },
      { id: 'caseback', name: 'Threaded Steel Solid Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Heavy-duty threaded solid caseback certifying 100m water resistance.', color: '#b4b4b8' },
      { id: 'strap', name: 'Solid 3-Link Steel Oyster Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Solid link stainless steel oyster bracelet with folding safety clasp and extension.', color: '#c4c4c8' },
    ],
  },

  // 21. Atlas Titanium Chrono
  'atlas-titanium-chrono': {
    slug: 'atlas-titanium-chrono',
    modelType: 'chronograph',
    primaryMetal: '#71717a',
    dialColor: '#27272a',
    strapColor: '#71717a',
    layers: [
      { id: 'crystal', name: 'Ultra-Tough Anti-Reflective Sapphire', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Heavy sapphire crystal with double fluoride anti-reflective glare coating.', color: '#88ccff' },
      { id: 'bezel', name: 'Matte Ceramic Tachymeter Bezel', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'Matte black scratch-proof ceramic bezel with laser-engraved speed scale.', color: '#18181b' },
      { id: 'hands', name: 'Skeletonized Titanium Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'High-contrast skeletonized hands counterweighted for chronograph precision.', color: '#e4e4e7' },
      { id: 'dial', name: 'Anthracite Brushed Chronograph Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Brushed anthracite dial with triple recessed registers and date aperture.', color: '#27272a' },
      { id: 'movement', name: 'Swiss Valjoux 7750 Automatic Chrono', stage: 'Phase 1: Chronograph Calibre', explodedOffset: 20, description: 'Legendary automatic chronograph movement with flyback column-wheel complication.', color: '#d4a017' },
      { id: 'case', name: 'Grade 5 Titanium Monobloc Case', stage: 'Phase 1: Titanium Chassis', explodedOffset: 80, description: '42mm ultra-lightweight Grade 5 titanium case with integrated pushers.', color: '#71717a' },
      { id: 'caseback', name: 'Grade 5 Titanium Exhibition Back', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Titanium caseback with sapphire viewing window and tungsten rotor.', color: '#71717a' },
      { id: 'strap', name: 'Grade 5 Titanium Solid Link Bracelet', stage: 'Phase 4: Bracelet Integration', explodedOffset: 210, description: 'Featherweight titanium bracelet with double-deployant security lock.', color: '#71717a' },
    ],
  },

  // 22. Purity Minimal Pure
  'purity-minimal-pure': {
    slug: 'purity-minimal-pure',
    modelType: 'minimal',
    primaryMetal: '#d4d4d8',
    dialColor: '#fafafa',
    strapColor: '#3f3f46',
    layers: [
      { id: 'crystal', name: 'Flush-Mounted Anti-Scratch Sapphire', stage: 'Phase 3: Optical Enclosure', explodedOffset: -180, description: 'Ultra-thin sapphire crystal mounted perfectly flush with bezel edge.', color: '#88ccff' },
      { id: 'bezel', name: 'Hair-Thin Surgical Steel Bezel', stage: 'Phase 3: Bezel Assembly', explodedOffset: -130, description: 'Micro-thin steel bezel engineered to maximize visual dial aperture.', color: '#e4e4e7' },
      { id: 'hands', name: 'Ultra-Fine Polished Needle Hands', stage: 'Phase 2: Hand Setting', explodedOffset: -85, description: 'Hairline-thin needle hands delivering pure, essential time reading.', color: '#52525b' },
      { id: 'dial', name: 'Architectural Stark White Dial', stage: 'Phase 2: Dial Mounting', explodedOffset: -40, description: 'Pure matte white dial with micro-thin applied silver indices.', color: '#fafafa' },
      { id: 'movement', name: 'Ultra-Thin 2.2mm Japanese Quartz', stage: 'Phase 1: Calibre Assembly', explodedOffset: 20, description: 'Ultra-slim 2.2mm movement enabling a record featherweight case profile.', color: '#d4d4d8' },
      { id: 'case', name: '34g Lightweight Brushed Steel Case', stage: 'Phase 1: Foundation Case', explodedOffset: 80, description: 'Featherweight 34g surgical steel monobloc case with low-profile crown.', color: '#d4d4d8' },
      { id: 'caseback', name: 'Snap-Fit Brushed Steel Caseback', stage: 'Phase 4: Hermetic Seal', explodedOffset: 145, description: 'Seamless snap-fit steel caseback certified to 30m water resistance.', color: '#d4d4d8' },
      { id: 'strap', name: 'Interchangeable Canvas NATO Strap', stage: 'Phase 4: Strap Assembly', explodedOffset: 210, description: 'Durable charcoal grey woven canvas NATO strap with steel pin buckle.', color: '#3f3f46' },
    ],
  },
};

const PRODUCT_ID_TO_SLUG: Record<string, string> = {
  p001: 'meridian-classic-gold',
  p002: 'titanova-chronograph-black',
  p003: 'titanova-heritage-steel',
  p004: 'titanova-royal-automatic',
  p005: 'titanova-elegance-gold',
  p006: 'titanova-pearl-silver',
  p007: 'titanova-rose-classic',
  p008: 'titanova-noir-automatic',
  p009: 'titanova-celestial-diamond',
  p010: 'meridian-urban-chrono',
  p011: 'meridian-prestige-gold',
  p012: 'meridian-azure-diver',
  p013: 'horizon-smart-elite',
  p014: 'matrix-smart-pro',
  p015: 'lyra-smart-fitness',
  p016: 'vanguard-diver-300',
  p017: 'terra-forest-automatic',
  p018: 'epoch-gmt-traveller',
  p019: 'soleil-ceramic-pure',
  p020: 'aurelia-pearl-elegance',
  p021: 'atlas-titanium-chrono',
  p022: 'purity-minimal-pure',
};

export function getWatchArchitecture(slugOrId: string): WatchArchitecture {
  if (!slugOrId) return WATCH_ARCHITECTURES['meridian-classic-gold'];
  const resolvedKey = PRODUCT_ID_TO_SLUG[slugOrId] || slugOrId;
  if (WATCH_ARCHITECTURES[resolvedKey]) {
    return WATCH_ARCHITECTURES[resolvedKey];
  }
  // Lookup by slug or fallback to default
  const found = Object.values(WATCH_ARCHITECTURES).find(w => w.slug === resolvedKey || w.slug === slugOrId);
  if (found) return found;
  return WATCH_ARCHITECTURES['meridian-classic-gold'];
}
