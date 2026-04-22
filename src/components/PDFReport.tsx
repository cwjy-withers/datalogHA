"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { FormValues } from '@/lib/schemas';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#112244',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        color: '#112244',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#666666',
        marginTop: 4,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    sectionTitle: {
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 5,
        marginBottom: 10,
        marginTop: 15,
        color: '#333333',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: 200,
        fontSize: 10,
        color: '#555555',
    },
    value: {
        fontSize: 10,
        color: '#000000',
        flex: 1,
    },
    table: {
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        paddingVertical: 4,
    },
    tableHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
        width: '50%',
    },
    tableCell: {
        fontSize: 10,
        color: '#555555',
        width: '50%',
        textAlign: 'right',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#999999',
    },
});

interface PDFReportProps {
    data: FormValues;
}

export const PDFReport = ({ data }: PDFReportProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Datalogging & Hörselrehabilitering</Text>
                <Text style={styles.subtitle}>Klinisk Rapport</Text>
            </View>

            {/* Patient Info */}
            <View>
                <Text style={styles.sectionTitle}>Patientinformation</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Patient ID / Namn:</Text>
                    <Text style={styles.value}>{data.patientId}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Datum:</Text>
                    <Text style={styles.value}>{data.date ? format(data.date, 'yyyy-MM-dd') : '-'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Åldersgrupp:</Text>
                    <Text style={styles.value}>{data.ageGroup} år</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Födelseår:</Text>
                    <Text style={styles.value}>{data.birthYear}</Text>
                </View>
            </View>

            {/* Clinical Data */}
            <View>
                <Text style={styles.sectionTitle}>Kliniska Data</Text>

                <View style={styles.row}>
                    <Text style={{ ...styles.label, fontWeight: 'bold' }}>Användningstid (tim/dag)</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Vänster:</Text>
                    <Text style={styles.value}>{data.usageTimeLeft || '-'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Höger:</Text>
                    <Text style={styles.value}>{data.usageTimeRight || '-'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={{ ...styles.label, fontWeight: 'bold', marginTop: 8 }}>Uppskattad användningstid</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Vänster:</Text>
                    <Text style={styles.value}>{data.estimatedUsageTimeLeft || '-'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Höger:</Text>
                    <Text style={styles.value}>{data.estimatedUsageTimeRight || '-'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={{ ...styles.label, fontWeight: 'bold', marginTop: 8 }}>Hörselstatus Vänster</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Basnedsättning:</Text>
                    <Text style={styles.value}>{data.basnedsattningLeft ? "Ja" : "Nej"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Diskantnedsättning:</Text>
                    <Text style={styles.value}>{data.diskantnedsattningLeft ? "Ja" : "Nej"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Flat loss:</Text>
                    <Text style={styles.value}>{data.flatLossLeft ? "Ja" : "Nej"}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={{ ...styles.label, fontWeight: 'bold', marginTop: 8 }}>Hörselstatus Höger</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Basnedsättning:</Text>
                    <Text style={styles.value}>{data.basnedsattningRight ? "Ja" : "Nej"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Diskantnedsättning:</Text>
                    <Text style={styles.value}>{data.diskantnedsattningRight ? "Ja" : "Nej"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Flat loss:</Text>
                    <Text style={styles.value}>{data.flatLossRight ? "Ja" : "Nej"}</Text>
                </View>
            </View>

            {/* Situational Data */}
            <View break={Object.keys(data.situationalRatings).length > 10}>
                <Text style={styles.sectionTitle}>Situationsbedömning</Text>
                <View style={styles.table}>
                    <View style={{ ...styles.tableRow, borderBottomWidth: 2 }}>
                        <Text style={styles.tableHeader}>Situation</Text>
                        <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}>Frekvens</Text>
                    </View>
                    {Object.entries(data.situationalRatings).map(([situation, rating]) => (
                        <View key={situation} style={styles.tableRow}>
                            <Text style={{ ...styles.tableHeader, fontWeight: 'normal' }}>{situation}</Text>
                            <Text style={styles.tableCell}>{rating}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <Text style={styles.footer}>
                Genererad av Datalogging Assistant | {format(new Date(), 'yyyy-MM-dd HH:mm')}
            </Text>
        </Page>
    </Document>
);
