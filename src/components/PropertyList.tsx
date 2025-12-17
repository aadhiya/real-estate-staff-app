// src/components/PropertyList.tsx
import React, { useEffect, useState } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Property, ConversionType } from '../types/property';

interface Filters {
    villageName: string;
    surveyNo: string;
    rtcOnly: boolean | null;
    convertedType: ConversionType | 'all';
    minAcres: number | null;
    maxAcres: number | null;
    minCost: number | null;
    maxCost: number | null;
    negotiableOnly: boolean;
}

const PropertyList: React.FC = () => {
    const [filters, setFilters] = useState<Filters>({
        villageName: '',
        surveyNo: '',
        rtcOnly: null,
        convertedType: 'all',
        minAcres: null,
        maxAcres: null,
        minCost: null,
        maxCost: null,
        negotiableOnly: false,
    });

    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState<Property[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFilterChange = (field: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Base collection
            let q: any = collection(db, 'properties');

            const whereClauses: any[] = [];

            // Firestore-friendly filters
            if (filters.rtcOnly !== null) {
                whereClauses.push(where('rtcAvailable', '==', filters.rtcOnly));
            }

            if (filters.convertedType !== 'all') {
                whereClauses.push(where('conversionType', '==', filters.convertedType));
            }

            if (filters.minAcres !== null) {
                whereClauses.push(where('areaAcres', '>=', filters.minAcres));
            }
            if (filters.maxAcres !== null) {
                whereClauses.push(where('areaAcres', '<=', filters.maxAcres));
            }

            if (filters.minCost !== null) {
                whereClauses.push(where('ownerLandCost', '>=', filters.minCost));
            }
            if (filters.maxCost !== null) {
                whereClauses.push(where('ownerLandCost', '<=', filters.maxCost));
            }

            if (whereClauses.length > 0) {
                q = query(q, ...whereClauses, orderBy('ownerLandCost', 'asc'), limit(100));
            } else {
                q = query(q, orderBy('createdAt', 'desc'), limit(100));
            }

            const snap = await getDocs(q);
            const docs: Property[] = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as any),
            }));

            // Client-side filters (partial text etc.)
            const filtered = docs.filter(p => {
                if (
                    filters.villageName &&
                    !p.villageName.toLowerCase().includes(filters.villageName.toLowerCase())
                ) {
                    return false;
                }
                if (
                    filters.surveyNo &&
                    !p.surveyNo.toLowerCase().includes(filters.surveyNo.toLowerCase())
                ) {
                    return false;
                }
                if (filters.negotiableOnly && !p.costNegotiable) {
                    return false;
                }
                return true;
            });

            setProperties(filtered);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchClick = (e: React.FormEvent) => {
        e.preventDefault();
        loadData();
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>View & Search Properties</h2>

            {/* Filters */}
            <form onSubmit={handleSearchClick} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Village name</label>
                        <input
                            className="input-field"
                            value={filters.villageName}
                            onChange={e => handleFilterChange('villageName', e.target.value)}
                            placeholder="Type village name"
                        />
                    </div>
                    <div>
                        <label>Survey number</label>
                        <input
                            className="input-field"
                            value={filters.surveyNo}
                            onChange={e => handleFilterChange('surveyNo', e.target.value)}
                            placeholder="Type S. No."
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Area (Acres) min / max</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                min={0}
                                className="input-field"
                                style={{ flex: 1 }}
                                value={filters.minAcres ?? ''}
                                onChange={e =>
                                    handleFilterChange(
                                        'minAcres',
                                        e.target.value === '' ? null : Number(e.target.value),
                                    )
                                }
                            />
                            <input
                                type="number"
                                min={0}
                                className="input-field"
                                style={{ flex: 1 }}
                                value={filters.maxAcres ?? ''}
                                onChange={e =>
                                    handleFilterChange(
                                        'maxAcres',
                                        e.target.value === '' ? null : Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <label>Owner land cost min / max</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                min={0}
                                className="input-field"
                                style={{ flex: 1 }}
                                value={filters.minCost ?? ''}
                                onChange={e =>
                                    handleFilterChange(
                                        'minCost',
                                        e.target.value === '' ? null : Number(e.target.value),
                                    )
                                }
                            />
                            <input
                                type="number"
                                min={0}
                                className="input-field"
                                style={{ flex: 1 }}
                                value={filters.maxCost ?? ''}
                                onChange={e =>
                                    handleFilterChange(
                                        'maxCost',
                                        e.target.value === '' ? null : Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Converted type</label>
                        <select
                            className="input-field"
                            value={filters.convertedType}
                            onChange={e =>
                                handleFilterChange('convertedType', e.target.value as ConversionType | 'all')
                            }
                        >
                            <option value="all">All</option>
                            <option value="none">Not converted</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.rtcOnly === true}
                                onChange={e =>
                                    handleFilterChange('rtcOnly', e.target.checked ? true : null)
                                }
                            />{' '}
                            RTC available only
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.negotiableOnly}
                                onChange={e =>
                                    handleFilterChange('negotiableOnly', e.target.checked)
                                }
                            />{' '}
                            Cost negotiable only
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ marginTop: '1rem', width: '100%' }}
                    disabled={loading}
                >
                    {loading ? 'Searching…' : 'Search'}
                </button>
            </form>

            {error && (
                <p style={{ color: 'red', marginBottom: '1rem' }}>
                    Error: {error}
                </p>
            )}

            {/* Results */}
            {properties.length === 0 && !loading && (
                <p>No properties match the current filters.</p>
            )}

            {properties.map(p => (
                <div
                    key={p.id}
                    style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 10,
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        background: '#fff',
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {p.villageName} – S. No. {p.surveyNo}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        Area: {p.areaAcres ?? 0} acres / {p.areaCents ?? 0} cents
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                        RTC: {p.rtcAvailable ? 'Yes' : 'No'} | Converted:{' '}
                        {p.conversionType === 'none' ? 'No' : p.conversionType}{' '}
                        | Khatha: {p.khathaAvailable ? 'Yes' : 'No'}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Owner: {p.ownerName} ({p.ownerMobile}) | Broker: {p.brokerName}{' '}
                        {p.brokerMobile && `(${p.brokerMobile})`}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Cost: {p.ownerLandCost ?? '-'} {p.costNegotiable ? '(Negotiable)' : ''}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PropertyList;
