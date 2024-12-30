//competitorform.tsx

"use client";

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info, Check, AlertCircle } from "lucide-react";

const CompetitorForm = () => {
  // States
  const [userInfo, setUserInfo] = useState({
    email: '',
    industry: '',
    companyDetails: {
      name: '',
      size: '',
      userBase: '',
      monetization: '',
      keyMetrics: '',
      businessDescription: ''
    }
  });

  const [existingTracking, setExistingTracking] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [competitors, setCompetitors] = useState([{
    name: '',
    ticker: '',
    domain: ''
  }]);
  const [metricPreferences, setMetricPreferences] = useState({
    financial: [],
    engagement: [],
    custom: ''
  });
  const [errors, setErrors] = useState({});

  const handleRemoveCompetitor = (index) => {
   setCompetitors(prevCompetitors => {
    // If this is the last competitor, just clear its fields
    if (prevCompetitors.length === 1) {
      return [{ name: '', ticker: '', domain: '' }];
     }
    // Otherwise, remove the competitor at the given index
      return prevCompetitors.filter((_, idx) => idx !== index);
    });
    };

  // Constants
  const financialMetrics = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'gross_margin', label: 'Gross Margin' },
    { value: 'operating_margin', label: 'Operating Margin' },
    { value: 'net_income', label: 'Net Income' },
    { value: 'eps', label: 'EPS' },
    { value: 'cash_flow', label: 'Cash Flow' },
    { value: 'arpu', label: 'ARPU' },
    { value: 'ltv', label: 'Customer LTV' },
    { value: 'cac', label: 'CAC' }
  ];

  const engagementMetrics = [
    { value: 'dau', label: 'Daily Active Users' },
    { value: 'mau', label: 'Monthly Active Users' },
    { value: 'retention', label: 'Retention Rate' },
    { value: 'churn', label: 'Churn Rate' },
    { value: 'paid_users', label: 'Paid Users' },
    { value: 'conversion', label: 'Conversion Rate' }
  ];

  const companySizes = [
    'Startup (<50 employees)',
    'Small (50-200 employees)',
    'Medium (201-1000 employees)',
    'Large (1001-5000 employees)',
    'Enterprise (5000+ employees)'
  ];

  const userBaseSizes = [
    'Pre-launch',
    '<10K users',
    '10K-100K users',
    '100K-1M users',
    '1M-10M users',
    '10M+ users'
  ];

  const monetizationModels = [
    'Subscription',
    'Freemium',
    'Usage-based',
    'Advertising',
    'Enterprise Sales',
    'Marketplace',
    'Other'
  ];

  const industries = [
    'Technology',
    'Financial Services',
    'Healthcare',
    'Consumer Goods',
    'Retail',
    'Entertainment',
    'Manufacturing',
    'Energy',
    'Telecommunications',
    'Other'
  ];

  // Handle form submission
    const handleFormSubmit = async (e) => {
      e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }
      
    // Create a copy of the state to avoid mutation and filter out empty competitors
    const formattedCompetitors = competitors.filter(comp => 
      comp.name.trim() !== '' || comp.ticker.trim() !== '' || comp.domain.trim() !== ''
    );
    
    // Validate that we have at least one competitor with data
    if (formattedCompetitors.length === 0) {
      alert('Please add at least one competitor');
     return;
    }

    const payload = {
      userInfo,
      existingTracking,
      emailVerified,
      competitors: formattedCompetitors,
      metricPreferences
    };

    try {
        const response = await fetch('/api/submit-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

     // Log the raw response
     const responseText = await response.text();
     console.log('Response status:', response.status);
     console.log('Raw response:', responseText);
     console.log('Request payload:', payload);
      
     // Try parsing as JSON
     let data;
     try {
       data = JSON.parse(responseText);
     } catch (e) {
        console.error('JSON Parse Error:', e);
        console.error('Response Text:', responseText);
       throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
     }

      console.log('Server response:', data);
      // TODO: handle success in UI
      console.log('Server response:', data);
     
     if (!response.ok) {
        console.error('Response not OK:', data);
        throw new Error(data.message || 'Submission failed');
     }
     
     alert('Form submitted successfully!');
     // Clear form after successful submission
     setCompetitors([{ name: '', ticker: '', domain: '' }]);
     setMetricPreferences({
       financial: [],
       engagement: [],
       custom: ''
     });
    // Reset form after successful submission
     setCompetitors([{ name: '', ticker: '', domain: '' }]);
     setMetricPreferences({
       financial: [],
       engagement: [],
       custom: ''
     });
    } catch (error) {
      console.error('Form submission error:', {
        error: error.message,
        stack: error.stack,
        payload
        });
      
      // TODO: handle error in UI
      console.error('Submission error:', error);
      alert('Error submitting form: ' + error.message);
    }
  };  

  // Handlers
  const handleMetricPreferenceChange = (category, value) => {
    setMetricPreferences(prev => ({
      ...prev,
      [category]: value
    }));

    if (errors[`metrics-${category}`]) {
      const newErrors = {...errors};
      delete newErrors[`metrics-${category}`];
      setErrors(newErrors);
    }
  };

  const checkExistingTracking = async (email) => {
    // Mock response
    return {
      competitors: [
        { name: 'Example Corp', ticker: 'EXMP', lastUpdate: '2024-03-15' },
        { name: 'Test Inc', ticker: 'TEST', lastUpdate: '2024-03-20' }
      ],
      sheetsUrl: 'https://docs.google.com/spreadsheets/d/example',
      docsUrl: 'https://docs.google.com/document/d/example'
    };
  };

  const validateForm = () => {
    const errors = {};
       
    if (!userInfo.companyDetails.name) {
      errors['company-name'] = 'Company name is required';
    }
    if (!userInfo.industry) {
      errors['industry'] = 'Industry is required';
    }
    if (!competitors.some(c => c.name || c.ticker)) {
      errors['competitors'] = 'At least one competitor is required';
    }
    if (!metricPreferences.financial.length) {
      errors['metrics-financial'] = 'Select at least one financial metric';
    }
     
    setErrors(errors);
      return Object.keys(errors).length === 0;
    };

  const handleEmailVerification = async () => {
    if (userInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      try {
        const existing = await checkExistingTracking(userInfo.email);
        setExistingTracking(existing);
        setEmailVerified(true);
      } catch (error) {
        console.error('Error checking existing tracking:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Quarterly Earnings Tracking Setup</h2>
          <p className="text-gray-600">Track up to 10 competitors and receive personalized analysis for your industry</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
            <h3 className="font-medium">How It Works:</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">📊</span>
                <span>Automated Data Updates: Key metrics and financial data in Google Sheets, with historical data for up to 4 previous quarters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">📝</span>
                <span>AI-Powered Analysis: Industry-specific insights and implications for your business</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">📫</span>
                <span>Personalized Email Reports: Customized analysis based on your company context</span>
              </li>
            </ul>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form className="space-y-8" onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Start with Your Email</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({...prev, email: e.target.value}))}
                  placeholder="your@email.com"
                  className="flex-1"
                />
                <Button 
                  type="button"
                  onClick={handleEmailVerification}
                  disabled={!userInfo.email || emailVerified}
                >
                  {emailVerified ? <Check className="h-4 w-4" /> : 'Verify'}
                </Button>
              </div>
            </div>

            {emailVerified && (
              <div className="space-y-6">
                {/* New Company Details Section */}
                    <div className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-medium">Your Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-1">Company Name*</label>
                    <Input
                    value={userInfo.companyDetails.name}
                    onChange={(e) => setUserInfo(prev => ({
                    ...prev,
                  companyDetails: {
                  ...prev.companyDetails,
                  name: e.target.value
                }
                }))}
                placeholder="Your company name"
                />
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Industry*</label>
                <Select
                value={userInfo.industry}
                onValueChange={(value) => setUserInfo(prev => ({
                ...prev,
                industry: value
                }))}
                >
              <SelectTrigger>
              <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
              {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
              {industry}
              </SelectItem>
              ))}
              </SelectContent>
              </Select>
              </div>
              <div>
              <label className="block text-sm font-medium mb-1">Business Description</label>
              <Textarea
              value={userInfo.companyDetails.businessDescription}
              onChange={(e) => setUserInfo(prev => ({
              ...prev,
              companyDetails: {
              ...prev.companyDetails,
              businessDescription: e.target.value
              }
              }))}
              placeholder="Brief description of your business model and main products/services"
              />
              </div>
              </div>
              </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Competitor Tracking</h3>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCompetitors([...competitors, { name: '', ticker: '', domain: '' }])}
                      disabled={
                           (competitors.length + (existingTracking?.competitors?.length || 0)) >= 10 ||
                           competitors.some(comp => !comp.name.trim() && !comp.ticker.trim() && !comp.domain.trim())
                        }
                    >
                      Add Company ({10 - (competitors.length + (existingTracking?.competitors?.length || 0))} slots remaining)
                    </Button>
                  </div>

                  {/* Existing tracked competitors */}
                  {existingTracking && existingTracking.competitors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Currently Tracking:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {existingTracking.competitors.map((comp, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-md flex justify-between items-start">
                            <div>
                              <div className="font-medium">{comp.name} ({comp.ticker})</div>
                              <div className="text-sm text-gray-600">Last updated: {comp.lastUpdate}</div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const newExisting = {
                                  ...existingTracking,
                                  competitors: existingTracking.competitors.filter((_, i) => i !== idx)
                                };
                                setExistingTracking(newExisting);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New competitors form fields */}
                  {competitors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Add New Companies:</h4>
                      <div className="space-y-4">
                      {competitors.map((comp, idx) => (
                            <div key={idx} className="p-4 border rounded-md space-y-3">
                                <div className="flex justify-between">
                                    <h5 className="font-medium">New Company #{idx + 1}</h5>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveCompetitor(idx)}
                                    >
                                    Remove
                        </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <Input
                                placeholder="Company Name"
                                value={comp.name}
                                onChange={(e) => {
                                  const newCompetitors = [...competitors];
                                  newCompetitors[idx].name = e.target.value;
                                  setCompetitors(newCompetitors);
                                }}
                              />
                              <Input
                                placeholder="Ticker Symbol"
                                value={comp.ticker}
                                onChange={(e) => {
                                  const newCompetitors = [...competitors];
                                  newCompetitors[idx].ticker = e.target.value;
                                  setCompetitors(newCompetitors);
                                }}
                              />
                              <Input
                                placeholder="Domain (e.g., company.com)"
                                value={comp.domain}
                                onChange={(e) => {
                                  const newCompetitors = [...competitors];
                                  newCompetitors[idx].domain = e.target.value;
                                  setCompetitors(newCompetitors);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Alert className="bg-blue-50 mt-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      When adding new competitors, we'll automatically retrieve and analyze their last 4 quarters of earnings data to provide historical context.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-medium">Custom Metric Preferences</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Select specific metrics you'd like to track for these competitors. We'll source these metrics exclusively from official earnings transcripts and releases to ensure accuracy.
                    </p>
                    <Alert className="bg-amber-50">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        For data quality, we only collect metrics that companies officially disclose in their earnings calls and financial releases.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Financial Metrics*</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {financialMetrics.map(metric => (
                            <label key={metric.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={metricPreferences.financial.includes(metric.value)}
                                onChange={(e) => {
                                  const updatedMetrics = e.target.checked
                                    ? [...metricPreferences.financial, metric.value]
                                    : metricPreferences.financial.filter(m => m !== metric.value);
                                  handleMetricPreferenceChange('financial', updatedMetrics);
                                }}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{metric.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Engagement Metrics*</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {engagementMetrics.map(metric => (
                            <label key={metric.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={metricPreferences.engagement.includes(metric.value)}
                                onChange={(e) => {
                                  const updatedMetrics = e.target.checked
                                    ? [...metricPreferences.engagement, metric.value]
                                    : metricPreferences.engagement.filter(m => m !== metric.value);
                                  handleMetricPreferenceChange('engagement', updatedMetrics);
                                }}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{metric.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Custom Metrics <span className="text-gray-500">(from official disclosures only)</span>
                        </label>
                        <Textarea
                          value={metricPreferences.custom}
                          onChange={(e) => handleMetricPreferenceChange('custom', e.target.value)}
                          placeholder="Enter any additional metrics typically disclosed in earnings calls (e.g., Platform GMV, Subscription Revenue, Active Merchants)"
                          rows={2}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Only include metrics that companies typically share in their earnings releases and calls.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <h3 className="font-medium">Your Tracking Documents</h3>
                  <div className="space-y-2">
                    <a 
                      href={existingTracking.sheetsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      📊 View Financial Metrics Sheet
                    </a>
                    <a 
                      href={existingTracking.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      📝 View Analysis Document
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                type="submit"
                className="w-full"
                disabled={!emailVerified}
              >
                Start Quarterly Earnings Tracking
              </Button>
              <p className="text-sm text-center text-gray-600">
                You'll receive a welcome email with your personalized tracking setup and document access.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorForm;