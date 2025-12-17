// src/components/PropertyForm.tsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Property, BuildingInfo, ConversionType } from '../types/property';

const PropertyForm: React.FC = () => {
    const [form, setForm] = useState<Property>({
        villageName: '',
        surveyNo: '',
        areaAcres: null,
        areaCents: null,

        rtcAvailable: false,
        fmbSketchDetails: '',
        conversionType: 'none',
        conversionOrderDetails: '',

        khathaAvailable: false,
        khathaDetails: '',

        ownerName: '',
        ownerAddress: '',
        ownerMobile: '',
        brokerName: '',
        brokerMobile: '',

        ownerLandCost: null,
        costNegotiable: false,

        borewells: null,
        openwellsLakesPonds: null,
        areca: { ageYears: null, yielding: false },
        coconut: { ageYears: null, yielding: false },
        otherCultivation: '',

        buildings: []
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (field: keyof Property, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleBuildingChange = (index: number, field: keyof BuildingInfo, value: any) => {
        const updated = [...form.buildings];
        updated[index] = { ...updated[index], [field]: value };
        setForm(prev => ({ ...prev, buildings: updated }));
    };

    const addBuilding = () => {
        setForm(prev => ({
            ...prev,
            buildings: [...prev.buildings, { areaSqft: null, yearOfConstruction: null }]
        }));
    };

    const removeBuilding = (index: number) => {
        const updated = [...form.buildings];
        updated.splice(index, 1);
        setForm(prev => ({ ...prev, buildings: updated }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const payload = {
                ...form,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            await addDoc(collection(db, 'properties'), payload);
            setMessage('✅ Property saved successfully');

            // reset basic fields, keep some defaults
            setForm({
                villageName: '',
                surveyNo: '',
                areaAcres: null,
                areaCents: null,
                rtcAvailable: false,
                fmbSketchDetails: '',
                conversionType: 'none',
                conversionOrderDetails: '',
                khathaAvailable: false,
                khathaDetails: '',
                ownerName: '',
                ownerAddress: '',
                ownerMobile: '',
                brokerName: '',
                brokerMobile: '',
                ownerLandCost: null,
                costNegotiable: false,
                borewells: null,
                openwellsLakesPonds: null,
                areca: { ageYears: null, yielding: false },
                coconut: { ageYears: null, yielding: false },
                otherCultivation: '',
                buildings: []
            });
        } catch (err) {
            setMessage('❌ Error saving: ' + (err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Property Details</h2>

            {/* 1 & 2: village name, survey number */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label>1) Village name *</label>
                    <input
                        className="input-field"
                        value={form.villageName}
                        onChange={e => handleChange('villageName', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>2) S. No. (Survey number) *</label>
                    <input
                        className="input-field"
                        value={form.surveyNo}
                        onChange={e => handleChange('surveyNo', e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* 3: Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label>3) Area (Acres)</label>
                    <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={form.areaAcres ?? ''}
                        onChange={e => handleChange('areaAcres', e.target.value === '' ? null : Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>3) Area (Cents)</label>
                    <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={form.areaCents ?? ''}
                        onChange={e => handleChange('areaCents', e.target.value === '' ? null : Number(e.target.value))}
                    />
                </div>
            </div>

            {/* 4: RTC available */}
            <div style={{ marginTop: '1rem' }}>
                <label>4) RTC available?</label>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={form.rtcAvailable}
                            onChange={e => handleChange('rtcAvailable', e.target.checked)}
                        />{' '}
                        Yes
                    </label>
                </div>
            </div>

            {/* 5: FMB Sketch (text description) */}
            <div style={{ marginTop: '1rem' }}>
                <label>5) FMB - Sketch (details / reference)</label>
                <textarea
                    className="input-field"
                    rows={2}
                    value={form.fmbSketchDetails}
                    onChange={e => handleChange('fmbSketchDetails', e.target.value)}
                />
            </div>

            {/* 6: Land converted */}
            <div style={{ marginTop: '1rem' }}>
                <label>6) Land if converted</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <label>
                        <input
                            type="radio"
                            value="none"
                            checked={form.conversionType === 'none'}
                            onChange={e => handleChange('conversionType', e.target.value as ConversionType)}
                        />{' '}
                        Not converted
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="residential"
                            checked={form.conversionType === 'residential'}
                            onChange={e => handleChange('conversionType', e.target.value as ConversionType)}
                        />{' '}
                        Residential
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="commercial"
                            checked={form.conversionType === 'commercial'}
                            onChange={e => handleChange('conversionType', e.target.value as ConversionType)}
                        />{' '}
                        Commercial
                    </label>
                </div>
                <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Order number, date, sketch details…"
                    value={form.conversionOrderDetails}
                    onChange={e => handleChange('conversionOrderDetails', e.target.value)}
                />
            </div>

            {/* 7: Khatha */}
            <div style={{ marginTop: '1rem' }}>
                <label>7) Khatha available?</label>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={form.khathaAvailable}
                            onChange={e => handleChange('khathaAvailable', e.target.checked)}
                        />{' '}
                        Yes
                    </label>
                </div>
                <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Khatha number / details"
                    value={form.khathaDetails}
                    onChange={e => handleChange('khathaDetails', e.target.value)}
                />
            </div>

            {/* 8–10: owner & broker */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                    <label>8) Owner name *</label>
                    <input
                        className="input-field"
                        value={form.ownerName}
                        onChange={e => handleChange('ownerName', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>9) Owner mobile number *</label>
                    <input
                        className="input-field"
                        value={form.ownerMobile}
                        onChange={e => handleChange('ownerMobile', e.target.value)}
                        required
                    />
                </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <label>8) Owner address</label>
                <textarea
                    className="input-field"
                    rows={2}
                    value={form.ownerAddress}
                    onChange={e => handleChange('ownerAddress', e.target.value)}
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                    <label>10) Broker name</label>
                    <input
                        className="input-field"
                        value={form.brokerName}
                        onChange={e => handleChange('brokerName', e.target.value)}
                    />
                </div>
                <div>
                    <label>10) Broker mobile number</label>
                    <input
                        className="input-field"
                        value={form.brokerMobile}
                        onChange={e => handleChange('brokerMobile', e.target.value)}
                    />
                </div>
            </div>

            {/* 11: cost */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                    <label>11) Owner land cost (per acre or total)</label>
                    <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={form.ownerLandCost ?? ''}
                        onChange={e => handleChange('ownerLandCost', e.target.value === '' ? null : Number(e.target.value))}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <input
                        type="checkbox"
                        checked={form.costNegotiable}
                        onChange={e => handleChange('costNegotiable', e.target.checked)}
                    />
                    <span>Cost negotiable</span>
                </div>
            </div>

            {/* 12: agricultural details */}
            <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>12) Agricultural details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label>a) Borewells (count)</label>
                    <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={form.borewells ?? ''}
                        onChange={e => handleChange('borewells', e.target.value === '' ? null : Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>b) Openwells / Lakes / Ponds (count)</label>
                    <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={form.openwellsLakesPonds ?? ''}
                        onChange={e =>
                            handleChange('openwellsLakesPonds', e.target.value === '' ? null : Number(e.target.value))
                        }
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label>c) Areca plantation – age (years)</label>
                    <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={form.areca.ageYears ?? ''}
                        onChange={e =>
                            setForm(prev => ({
                                ...prev,
                                areca: { ...prev.areca, ageYears: e.target.value === '' ? null : Number(e.target.value) }
                            }))
                        }
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={form.areca.yielding}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    areca: { ...prev.areca, yielding: e.target.checked }
                                }))
                            }
                        />{' '}
                        Yielding
                    </label>
                </div>
                <div>
                    <label>d) Coconut – age (years)</label>
                    <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={form.coconut.ageYears ?? ''}
                        onChange={e =>
                            setForm(prev => ({
                                ...prev,
                                coconut: {
                                    ...prev.coconut,
                                    ageYears: e.target.value === '' ? null : Number(e.target.value)
                                }
                            }))
                        }
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={form.coconut.yielding}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    coconut: { ...prev.coconut, yielding: e.target.checked }
                                }))
                            }
                        />{' '}
                        Yielding
                    </label>
                </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>e) Rubber or any other cultivation / etc.</label>
                <textarea
                    className="input-field"
                    rows={2}
                    value={form.otherCultivation}
                    onChange={e => handleChange('otherCultivation', e.target.value)}
                />
            </div>

            {/* 13: buildings */}
            <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>13) Buildings available</h3>
            {form.buildings.map((b, idx) => (
                <div
                    key={idx}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        padding: '0.75rem',
                        marginBottom: '0.75rem'
                    }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Area (sqft)</label>
                            <input
                                type="number"
                                min={0}
                                className="input-field"
                                value={b.areaSqft ?? ''}
                                onChange={e =>
                                    handleBuildingChange(
                                        idx,
                                        'areaSqft',
                                        e.target.value === '' ? null : Number(e.target.value)
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label>Year of construction</label>
                            <input
                                type="number"
                                min={1800}
                                max={3000}
                                className="input-field"
                                value={b.yearOfConstruction ?? ''}
                                onChange={e =>
                                    handleBuildingChange(
                                        idx,
                                        'yearOfConstruction',
                                        e.target.value === '' ? null : Number(e.target.value)
                                    )
                                }
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeBuilding(idx)}
                        style={{
                            marginTop: '0.25rem',
                            border: 'none',
                            background: 'transparent',
                            color: '#c00',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Remove building
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addBuilding}
                className="btn-primary"
                style={{ marginBottom: '1.5rem' }}
            >
                + Add building
            </button>

            <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1.05rem' }}
                disabled={saving}
            >
                {saving ? 'Saving…' : 'Save property'}
            </button>

            {message && (
                <p style={{ marginTop: '1rem', fontWeight: 600 }}>
                    {message}
                </p>
            )}
        </form>
    );
};

export default PropertyForm;
