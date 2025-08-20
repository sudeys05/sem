
import { EvidenceCRUD } from './mongodb-crud.js';

export async function seedEvidence() {
  console.log('🌱 Seeding Evidence Data...');
  
  try {
    // Check if evidence already exists
    const existingEvidence = await EvidenceCRUD.findAll();
    if (existingEvidence.length > 0) {
      console.log('📊 Evidence data already exists, skipping seed');
      return;
    }

    const sampleEvidence = [
      {
        type: 'Physical',
        description: 'Bloody knife found at crime scene',
        location: 'Kitchen counter, 123 Main St',
        collectedBy: 'Officer Johnson',
        caseId: null,
        obId: null,
        tags: ['weapon', 'blood', 'fingerprints'],
        weight: '0.5 kg',
        condition: 'Good',
        storageLocation: 'Evidence Room A',
        evidenceRoom: 'A-101',
        bagsSealed: true,
        photographed: true,
        fingerprinted: true,
        dnaCollected: true,
        priority: 'High',
        notes: 'Handle with extreme care - potential DNA evidence'
      },
      {
        type: 'Digital',
        description: 'Mobile phone containing text messages',
        location: 'Suspect\'s pocket during arrest',
        collectedBy: 'Detective Smith',
        caseId: null,
        obId: null,
        tags: ['phone', 'digital', 'messages'],
        serialNumber: 'IMEI: 123456789012345',
        condition: 'Excellent',
        storageLocation: 'Digital Evidence Lab',
        evidenceRoom: 'D-205',
        bagsSealed: true,
        photographed: true,
        priority: 'Medium',
        notes: 'Requires digital forensics analysis'
      },
      {
        type: 'Photo',
        description: 'Crime scene photographs',
        location: 'Entire crime scene area',
        collectedBy: 'Forensics Team',
        caseId: null,
        obId: null,
        tags: ['photos', 'scene', 'documentation'],
        condition: 'Excellent',
        storageLocation: 'Digital Archive',
        evidenceRoom: 'Digital',
        photographed: false, // These ARE the photographs
        priority: 'Medium',
        notes: 'High-resolution crime scene documentation'
      },
      {
        type: 'Document',
        description: 'Threatening letter received by victim',
        location: 'Victim\'s mailbox',
        collectedBy: 'Officer Davis',
        caseId: null,
        obId: null,
        tags: ['document', 'threat', 'handwriting'],
        dimensions: '8.5" x 11"',
        condition: 'Fair',
        storageLocation: 'Document Storage',
        evidenceRoom: 'C-150',
        bagsSealed: true,
        photographed: true,
        fingerprinted: true,
        priority: 'High',
        notes: 'Potential handwriting analysis required'
      },
      {
        type: 'Video',
        description: 'Security camera footage',
        location: 'Store security system',
        collectedBy: 'Detective Wilson',
        caseId: null,
        obId: null,
        tags: ['video', 'surveillance', 'security'],
        condition: 'Good',
        storageLocation: 'Digital Evidence Lab',
        evidenceRoom: 'D-210',
        photographed: false,
        priority: 'High',
        notes: 'Shows suspect entering and leaving premises'
      }
    ];

    console.log('📝 Creating sample evidence entries...');
    
    for (let i = 0; i < sampleEvidence.length; i++) {
      const evidence = sampleEvidence[i];
      console.log(`🔍 Creating evidence ${i + 1}/${sampleEvidence.length}: ${evidence.description}`);
      
      const created = await EvidenceCRUD.create(evidence);
      console.log(`✅ Created evidence: ${created.evidenceNumber}`);
    }

    console.log('🌱 Evidence seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding evidence:', error);
  }
}
