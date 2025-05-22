import { useState } from "react";
import { DollarSign, PiggyBank, TrendingUp, BarChart3, Target, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CashflowRoom = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for the cashflow dashboard
  const financialData = {
    income: 5200,
    expenses: 3450,
    savings: 1750,
    savingsGoal: 10000,
    currentSavings: 7500,
    investments: [
      { name: "Stocks", value: 12500, growth: 7.2 },
      { name: "Crypto", value: 3800, growth: -2.5 },
      { name: "Real Estate", value: 25000, growth: 4.1 }
    ],
    budgets: [
      { category: "Housing", allocated: 1500, spent: 1450 },
      { category: "Food", allocated: 600, spent: 580 },
      { category: "Transportation", allocated: 400, spent: 350 },
      { category: "Entertainment", allocated: 300, spent: 420 },
      { category: "Utilities", allocated: 250, spent: 230 }
    ],
    challenges: [
      { id: 1, name: "Save $500 this month", progress: 75, reward: "Financial Freedom Badge" },
      { id: 2, name: "Reduce dining out by 30%", progress: 60, reward: "Budget Master Badge" },
      { id: 3, name: "Invest $200 in stocks", progress: 100, reward: "Investor Badge" }
    ],
    badges: [
      { id: 1, name: "Budget Master", earned: true },
      { id: 2, name: "Savings Champion", earned: true },
      { id: 3, name: "Debt Destroyer", earned: false },
      { id: 4, name: "Investment Guru", earned: false }
    ]
  };
  
  // Calculate savings progress
  const savingsProgress = (financialData.currentSavings / financialData.savingsGoal) * 100;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-grindos-purple" />
        Cashflow Room
      </h1>
      
      <p className="text-muted-foreground mb-6">
        Master your money with clarity and motivation.
      </p>
      
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.income}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-red-500" />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.expenses}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-blue-500" />
                  Monthly Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.savings}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Savings Goal Progress</CardTitle>
              <CardDescription>
                ${financialData.currentSavings} of ${financialData.savingsGoal}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={savingsProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {savingsProgress.toFixed(0)}% towards your goal
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Earned Badges</CardTitle>
              <CardDescription>Your financial achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {financialData.badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      badge.earned ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800/20 opacity-50'
                    }`}
                  >
                    <BadgeCheck className={`h-5 w-5 ${badge.earned ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={badge.earned ? 'font-medium' : 'text-muted-foreground'}>{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Breakdown</CardTitle>
              <CardDescription>Track your spending against budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData.budgets.map((budget, index) => {
                  const percentage = (budget.spent / budget.allocated) * 100;
                  const isOverBudget = budget.spent > budget.allocated;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{budget.category}</span>
                        <span className={isOverBudget ? 'text-red-500' : ''}>
                          ${budget.spent} / ${budget.allocated}
                        </span>
                      </div>
                      <Progress 
                        value={percentage > 100 ? 100 : percentage} 
                        className={`h-2 ${isOverBudget ? 'bg-red-200' : ''}`}
                        indicatorClassName={isOverBudget ? 'bg-red-500' : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="investments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {financialData.investments.map((investment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{investment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${investment.value}</div>
                  <div className={`flex items-center ${
                    investment.growth >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {investment.growth >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    {investment.growth}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Challenges</CardTitle>
              <CardDescription>Complete challenges to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {financialData.challenges.map(challenge => (
                  <div key={challenge.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{challenge.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Reward: {challenge.reward}
                      </span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                    <div className="text-sm text-right">{challenge.progress}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                <Target className="mr-2 h-4 w-4" />
                Start New Challenge
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashflowRoom;
